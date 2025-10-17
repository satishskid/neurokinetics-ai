import db from "../db";

export interface TaskRecord {
  id: number;
  sessionId: number;
  taskType: string;
  taskName: string;
  durationSeconds: number;
  engagementScore: number;
  rawData: Record<string, any>;
}

export interface AnalysisResult {
  asdProbability: number; // 0-100
  confidenceLevel: "high" | "medium" | "low";
  severityScore: 1 | 2 | 3;
  socialCommunicationScore: number; // 0-100 (higher is better)
  repetitiveBehaviorsScore: number; // 0-100 (higher is better)
  sensoryProcessingScore: number; // 0-100 (higher is better)
  motorCoordinationScore: number; // 0-100 (higher is better)
  redFlags: string[];
  keyObservations: Array<{ timestamp: string; behavior: string }>;
  recommendation: "refer_for_diagnostic" | "monitor" | "reassure";
  analysisData: Record<string, any>;
}

// Fetch all tasks for a session
async function fetchTasks(sessionId: number): Promise<TaskRecord[]> {
  const tasks = await db.queryAll<TaskRecord>`
    SELECT 
      id, session_id as "sessionId", task_type as "taskType", task_name as "taskName",
      duration_seconds as "durationSeconds", engagement_score as "engagementScore",
      raw_data as "rawData"
    FROM screening_tasks
    WHERE session_id = ${sessionId}
    ORDER BY id ASC
  `;
  return tasks ?? [];
}

// Utility: clamp to [0, 100]
function clamp100(n: number): number {
  if (!Number.isFinite(n)) return 50;
  return Math.max(0, Math.min(100, n));
}

// Compute domain scores based on available rawData keys and engagement
function computeDomainScores(tasks: TaskRecord[]) {
  // Weighted averages per domain
  let socialAccum = 0, socialWeight = 0;
  let repetitiveAccum = 0, repetitiveWeight = 0;
  let sensoryAccum = 0, sensoryWeight = 0;
  let motorAccum = 0, motorWeight = 0;

  const toPct = (val: any, fallback = 0.5) => {
    if (val == null) return fallback * 100;
    const v = typeof val === "number" ? val : Number(val);
    if (!Number.isFinite(v)) return fallback * 100;
    // assume raw fraction 0..1; if looks like 0..100 keep as-is
    return v <= 1 ? v * 100 : v;
  };

  for (const t of tasks) {
    const e = toPct(t.engagementScore ?? 0.5) / 100; // 0..1
    const d = Math.max(1, t.durationSeconds || 1);
    const w = e * Math.log(1 + d); // time-weighted by engagement

    const r = t.rawData || {};

    // Social communication indicators
    const eye = toPct(r.eyeContact);
    const nameResp = toPct(r.nameResponse);
    const joint = toPct(r.jointAttention);
    const socialReciprocity = toPct(r.socialReciprocity);
    const socialScore = (eye + nameResp + joint + socialReciprocity) / 4 || toPct(r.socialScore, e);

    socialAccum += w * socialScore;
    socialWeight += w;

    // Repetitive behaviors indicators (higher is worse; we invert to positive capability)
    const repetitiveIntensity = toPct(r.repetitiveIntensity, 0.3); // 0..100 risk
    const repetitiveFrequency = toPct(r.repetitiveFrequency, 0.3);
    const repetitiveCombined = (repetitiveIntensity + repetitiveFrequency) / 2;
    const repetitiveCapability = 100 - repetitiveCombined; // positive domain score

    repetitiveAccum += w * repetitiveCapability;
    repetitiveWeight += w;

    // Sensory processing (higher sensitivity => lower capability)
    const sensoryHypo = toPct(r.sensoryHypo, 0.5);
    const sensoryHyper = toPct(r.sensoryHyper, 0.5);
    const sensoryCombined = (sensoryHypo + sensoryHyper) / 2;
    const sensoryCapability = 100 - sensoryCombined;

    sensoryAccum += w * sensoryCapability;
    sensoryWeight += w;

    // Motor coordination
    const fineMotor = toPct(r.fineMotor, 0.5);
    const grossMotor = toPct(r.grossMotor, 0.5);
    const motorPlanning = toPct(r.motorPlanning, 0.5);
    const imitation = toPct(r.imitation, 0.5);
    const motorScore = (fineMotor + grossMotor + motorPlanning + imitation) / 4;

    motorAccum += w * motorScore;
    motorWeight += w;
  }

  const social = clamp100(socialWeight ? socialAccum / socialWeight : 55);
  const repetitive = clamp100(repetitiveWeight ? repetitiveAccum / repetitiveWeight : 60);
  const sensory = clamp100(sensoryWeight ? sensoryAccum / sensoryWeight : 58);
  const motor = clamp100(motorWeight ? motorAccum / motorWeight : 62);

  return { social, repetitive, sensory, motor };
}

// Compute overall ASD probability using inverse of capabilities (risk index) and calibration
function computeProbability(dom: { social: number; repetitive: number; sensory: number; motor: number }, tasks: TaskRecord[]) {
  // Risk indexes: higher risk -> higher probability
  const riskSocial = 100 - dom.social;
  const riskRep = 100 - dom.repetitive;
  const riskSens = 100 - dom.sensory;
  const riskMotor = 100 - dom.motor;

  const n = tasks.length;
  const avgEng = tasks.reduce((acc, t) => acc + (typeof t.engagementScore === "number" ? t.engagementScore : 0.5), 0) / Math.max(1, n);
  const avgEng01 = avgEng <= 1 ? avgEng : avgEng / 100;

  // Linear combination + logistic map; coefficients tuned conservatively for screening (not diagnosis)
  const z = 0.045 * riskSocial + 0.035 * riskRep + 0.03 * riskSens + 0.02 * riskMotor + (-1.5);
  const sigmoid = 1 / (1 + Math.exp(-z));

  // Engagement factor reduces overconfidence when low engagement
  const engagementAdj = 0.85 + 0.3 * avgEng01; // 0.85 .. 1.15
  const prob = clamp100(sigmoid * 100 * engagementAdj);

  return prob;
}

function computeConfidence(tasks: TaskRecord[], probability: number): "high" | "medium" | "low" {
  const n = tasks.length;
  const avgEng = tasks.reduce((acc, t) => acc + (typeof t.engagementScore === "number" ? t.engagementScore : 0.5), 0) / Math.max(1, n);
  const avgEng01 = avgEng <= 1 ? avgEng : avgEng / 100;

  if (n >= 6 && avgEng01 >= 0.65) return "high";
  if (n >= 3 && avgEng01 >= 0.5) return "medium";
  return "low";
}

function computeSeverity(probability: number): 1 | 2 | 3 {
  if (probability >= 70) return 3;
  if (probability >= 50) return 2;
  return 1;
}

function deriveRedFlags(tasks: TaskRecord[], dom: { social: number; repetitive: number; sensory: number; motor: number }): string[] {
  const flags: Set<string> = new Set();
  const push = (s: string) => flags.add(s);

  if (dom.social < 45) push("Reduced eye contact and social reciprocity");
  if (dom.social < 50) push("Delayed response to name or limited joint attention");
  if (100 - dom.repetitive > 50) push("Elevated repetitive behaviors or restricted interests");
  if (100 - dom.sensory > 45) push("Atypical sensory processing (hyper/hypo sensitivity)");
  if (dom.motor < 55) push("Motor coordination or imitation challenges");

  for (const t of tasks) {
    const r = t.rawData || {};
    if (r.noEyeContact === true) push("Minimal eye contact during social tasks");
    if (r.noNameResponse === true) push("No response to name");
    if (r.handFlapping === true) push("Observed hand flapping");
    if (r.spinRepetitions && r.spinRepetitions > 3) push("Object spinning / repetitive motions");
    if (r.coverEars === true) push("Hyperacusis / covers ears to sounds");
  }
  return Array.from(flags);
}

function extractObservations(tasks: TaskRecord[]): Array<{ timestamp: string; behavior: string }> {
  const obs: Array<{ timestamp: string; behavior: string }> = [];
  let timeCursor = 0;
  for (const t of tasks) {
    timeCursor += Math.max(5, t.durationSeconds || 5);
    const r = t.rawData || {};
    if (r.observation && typeof r.observation === "string") {
      obs.push({ timestamp: new Date(timeCursor * 1000).toISOString().substring(11, 19), behavior: r.observation });
    } else {
      if (r.noEyeContact) obs.push({ timestamp: new Date(timeCursor * 1000).toISOString().substring(11, 19), behavior: "Limited eye contact during task" });
      if (r.noNameResponse) obs.push({ timestamp: new Date(timeCursor * 1000).toISOString().substring(11, 19), behavior: "No response to name" });
      if (r.handFlapping) obs.push({ timestamp: new Date(timeCursor * 1000).toISOString().substring(11, 19), behavior: "Repetitive hand flapping observed" });
    }
  }
  // fallback observation if none detected
  if (obs.length === 0) {
    obs.push({ timestamp: "00:02:00", behavior: "Typical engagement with intermittent gaze shifts" });
  }
  return obs.slice(0, 6);
}

export async function analyzeScreeningSession(sessionId: number): Promise<AnalysisResult> {
  const tasks = await fetchTasks(sessionId);
  const dom = computeDomainScores(tasks);
  const probability = computeProbability(dom, tasks);
  const confidence = computeConfidence(tasks, probability);
  const severity = computeSeverity(probability);
  const flags = deriveRedFlags(tasks, dom);
  const observations = extractObservations(tasks);

  // Recommendation policy: conservative for screening
  let recommendation: AnalysisResult["recommendation"] = "monitor";
  if (probability >= 60 || severity === 3) recommendation = "refer_for_diagnostic";
  else if (probability < 35 && confidence !== "low") recommendation = "reassure";

  const analysisData = {
    tasksAnalyzed: tasks.length,
    domainScores: dom,
    engagementAverage: tasks.length
      ? tasks.reduce((acc, t) => acc + (typeof t.engagementScore === "number" ? t.engagementScore : 0.5), 0) / tasks.length
      : 0.5,
    calibrationVersion: "v0.1-internal",
    notes: "Heuristic domain-based scoring for screening; not diagnostic.",
  };

  return {
    asdProbability: probability,
    confidenceLevel: confidence,
    severityScore: severity,
    socialCommunicationScore: dom.social,
    repetitiveBehaviorsScore: dom.repetitive,
    sensoryProcessingScore: dom.sensory,
    motorCoordinationScore: dom.motor,
    redFlags: flags,
    keyObservations: observations,
    recommendation,
    analysisData,
  };
}