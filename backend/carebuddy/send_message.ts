import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import db from "../db";

interface SendMessageRequest {
  conversationId: number;
  content: string;
}

interface Message {
  id: number;
  role: string;
  content: string;
  references?: Array<{
    title: string;
    source: string;
    url?: string;
  }>;
  createdAt: Date;
}

interface SendMessageResponse {
  userMessage: Message;
  assistantMessage: Message;
}

export const sendMessage = api<SendMessageRequest, SendMessageResponse>(
  { expose: true, method: "POST", path: "/carebuddy/message", auth: true },
  async (req) => {
    const auth = getAuthData()!;
    const userRole = auth.role;
    
    const conversation = await db.queryRow<{ userRole: string; childId?: number }>`
      SELECT user_role as "userRole", child_id as "childId"
      FROM care_buddy_conversations
      WHERE id = ${req.conversationId} AND user_id = ${auth.userID}
    `;
    
    if (!conversation) {
      throw new Error("Conversation not found");
    }
    const userMessage = await db.queryRow<Message>`
      INSERT INTO care_buddy_messages (conversation_id, role, content)
      VALUES (${req.conversationId}, 'user', ${req.content})
      RETURNING id, role, content, created_at as "createdAt"
    `;
    
    if (!userMessage) {
      throw new Error("Failed to save user message");
    }
    
    const { response, references } = await generateContextualResponse(
      req.content,
      userRole,
      conversation.childId
    );
    
    const assistantMessage = await db.queryRow<Message>`
      INSERT INTO care_buddy_messages (conversation_id, role, content, refs)
      VALUES (${req.conversationId}, 'assistant', ${response}, ${JSON.stringify(references)})
      RETURNING id, role, content, refs as "references", created_at as "createdAt"
    `;
    
    if (!assistantMessage) {
      throw new Error("Failed to save assistant message");
    }
    
    return { 
      userMessage, 
      assistantMessage: {
        ...assistantMessage,
        references: references
      }
    };
  }
);

async function generateContextualResponse(
  content: string,
  userRole: "parent" | "provider" | "admin" | "doctor",
  childId?: number
): Promise<{ response: string; references: Array<{ title: string; source: string; url?: string }> }> {
  const references: Array<{ title: string; source: string; url?: string }> = [];
  let metaPrompt = "";
  let response = "";

  if (userRole === "parent") {
    metaPrompt = `You are Care Buddy, a compassionate AI assistant helping parents understand and support their child with autism. 
Provide empathetic, evidence-based guidance in simple language. Always cite trusted sources.
Focus on: daily care strategies, understanding behaviors, implementing interventions at home, emotional support.`;
    
    if (content.toLowerCase().includes('behavior') || content.toLowerCase().includes('meltdown')) {
      response = "I understand how challenging meltdowns can be. Let me help you understand what might be triggering them and how to respond effectively.\n\nMeltdowns often occur when a child is overwhelmed by sensory input, changes in routine, or communication difficulties. Here's what you can do:\n\n1. **Identify Triggers**: Keep a diary noting what happened before each meltdown\n2. **Create a Calm Space**: Designate a quiet area with minimal sensory input\n3. **Use Visual Supports**: Picture schedules help children prepare for transitions\n4. **Stay Calm**: Your calm presence helps regulate their emotions\n\nRemember, meltdowns are not tantrums - they're a sign of overwhelm, not misbehavior.";
      references.push(
        { title: "Understanding Autism Meltdowns", source: "Autism Speaks", url: "https://www.autismspeaks.org" },
        { title: "Visual Supports and Schedules", source: "National Autistic Society" }
      );
    } else if (content.toLowerCase().includes('therapy') || content.toLowerCase().includes('intervention')) {
      response = "Early intervention makes a significant difference! Here are evidence-based approaches:\n\n**Applied Behavior Analysis (ABA)**: Focuses on teaching skills and reducing challenging behaviors through positive reinforcement.\n\n**Speech Therapy**: Helps develop communication skills, whether verbal or through alternative methods.\n\n**Occupational Therapy**: Addresses sensory processing and daily living skills.\n\n**Early Start Denver Model (ESDM)**: Naturalistic, play-based approach for young children.\n\nThe key is finding what works for your child and maintaining consistency. Would you like specific activities you can practice at home?";
      references.push(
        { title: "Evidence-Based Practices in Autism", source: "National Clearinghouse on Autism Evidence and Practice" },
        { title: "Parent-Mediated Interventions", source: "Cochrane Review" }
      );
    } else {
      response = "I'm here to support you on this journey. As a parent, you're your child's best advocate and teacher. I can help with:\n\n• Understanding autism and your child's unique needs\n• Implementing therapies and interventions at home\n• Managing daily challenges and behaviors\n• Finding resources and support in your community\n• Celebrating progress and milestones\n\nWhat would you like to explore today?";
      references.push(
        { title: "Parent's Guide to Autism", source: "CDC Autism Resources" }
      );
    }
  } else if (userRole === "provider" || userRole === "doctor") {
    metaPrompt = `You are Care Buddy, a clinical AI assistant for healthcare providers working with autism.
Provide evidence-based, clinical-grade information with proper citations.
Reference DSM-5 criteria, peer-reviewed research, and clinical guidelines.
Focus on: assessment protocols, treatment planning, evidence-based interventions, clinical decision support.`;
    
    if (content.toLowerCase().includes('assessment') || content.toLowerCase().includes('screening')) {
      response = "**Clinical Assessment Protocols**\n\nFor autism screening and assessment, current best practices include:\n\n**Level 1 Screening** (18-24 months):\n- M-CHAT-R/F (Modified Checklist for Autism in Toddlers)\n- Sensitivity: 85%, Specificity: 93%\n\n**Level 2 Diagnostic Assessment**:\n- ADOS-2 (Autism Diagnostic Observation Schedule)\n- ADI-R (Autism Diagnostic Interview-Revised)\n- DSM-5 diagnostic criteria\n\n**Considerations**:\n- Cultural and linguistic adaptations\n- Differential diagnosis (language disorders, ID, ADHD)\n- Co-occurring conditions assessment\n\n**Recommended Timeline**: If M-CHAT-R positive, refer for comprehensive evaluation within 30 days per AAP guidelines.";
      references.push(
        { title: "Identification and Evaluation of Children With Autism Spectrum Disorders", source: "Pediatrics, AAP Clinical Report (2020)" },
        { title: "ADOS-2 Psychometric Properties", source: "Journal of Autism and Developmental Disorders" },
        { title: "DSM-5 Autism Spectrum Disorder Criteria", source: "American Psychiatric Association" }
      );
    } else if (content.toLowerCase().includes('intervention') || content.toLowerCase().includes('treatment')) {
      response = "**Evidence-Based Intervention Protocols**\n\n**Comprehensive Behavioral Interventions** (High Evidence):\n- Early Intensive Behavioral Intervention (EIBI): 20-40 hrs/week\n- Early Start Denver Model (ESDM): Naturalistic developmental approach\n- Effect sizes: 0.69 (cognitive), 0.53 (language)\n\n**Focused Interventions** (High Evidence):\n- Pivotal Response Treatment (PRT)\n- Discrete Trial Training (DTT)\n- Naturalistic Developmental Behavioral Interventions (NDBI)\n\n**Implementation Guidelines**:\n1. Start before age 3 when possible\n2. Minimum 15-25 hours/week for comprehensive programs\n3. Parent involvement critical (effect size: 0.42)\n4. Regular progress monitoring with validated tools\n\n**Contraindicated**: Facilitated communication, sensory integration as standalone treatment.";
      references.push(
        { title: "Evidence-Based Practices for Children with Autism", source: "National Clearinghouse on Autism Evidence and Practice (2020)" },
        { title: "Early Intervention for Young Children with ASD", source: "Pediatrics, AAP Clinical Report" },
        { title: "Systematic Review of Behavioral Interventions", source: "JAMA Pediatrics" }
      );
    } else {
      response = "**Clinical Decision Support**\n\nI can assist with:\n• Evidence-based assessment protocols\n• Treatment planning and intervention selection\n• Interpreting diagnostic criteria (DSM-5, ICD-11)\n• Current research and clinical guidelines\n• Differential diagnosis considerations\n• Pharmacological intervention evidence\n\nAll recommendations include peer-reviewed citations and evidence levels. What clinical question can I help with?";
      references.push(
        { title: "Practice Guidelines for Autism Spectrum Disorder", source: "American Academy of Child and Adolescent Psychiatry" }
      );
    }
  }

  return { response, references };
}
