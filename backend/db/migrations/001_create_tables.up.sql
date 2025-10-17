-- Users table with role-based access
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  clerk_id TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('parent', 'provider', 'admin')),
  full_name TEXT,
  organization TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Children profiles
CREATE TABLE children (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  age_months INTEGER NOT NULL,
  sex TEXT NOT NULL CHECK (sex IN ('male', 'female', 'other')),
  developmental_concerns TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Screening sessions
CREATE TABLE screening_sessions (
  id BIGSERIAL PRIMARY KEY,
  child_id BIGINT NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('in_progress', 'completed', 'abandoned')),
  started_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,
  total_duration_seconds INTEGER,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Screening tasks (individual games/activities)
CREATE TABLE screening_tasks (
  id BIGSERIAL PRIMARY KEY,
  session_id BIGINT NOT NULL REFERENCES screening_sessions(id) ON DELETE CASCADE,
  task_type TEXT NOT NULL,
  task_name TEXT NOT NULL,
  started_at TIMESTAMP NOT NULL,
  completed_at TIMESTAMP,
  duration_seconds INTEGER,
  engagement_score DOUBLE PRECISION,
  raw_data JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Assessment results
CREATE TABLE assessment_results (
  id BIGSERIAL PRIMARY KEY,
  session_id BIGINT NOT NULL REFERENCES screening_sessions(id) ON DELETE CASCADE,
  child_id BIGINT NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  asd_probability DOUBLE PRECISION NOT NULL CHECK (asd_probability >= 0 AND asd_probability <= 100),
  confidence_level TEXT NOT NULL CHECK (confidence_level IN ('high', 'medium', 'low')),
  severity_score INTEGER CHECK (severity_score >= 1 AND severity_score <= 3),
  social_communication_score DOUBLE PRECISION CHECK (social_communication_score >= 0 AND social_communication_score <= 100),
  repetitive_behaviors_score DOUBLE PRECISION CHECK (repetitive_behaviors_score >= 0 AND repetitive_behaviors_score <= 100),
  sensory_processing_score DOUBLE PRECISION CHECK (sensory_processing_score >= 0 AND sensory_processing_score <= 100),
  motor_coordination_score DOUBLE PRECISION CHECK (motor_coordination_score >= 0 AND motor_coordination_score <= 100),
  red_flags JSONB,
  key_observations JSONB,
  recommendation TEXT NOT NULL,
  analysis_data JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Clinical reports
CREATE TABLE clinical_reports (
  id BIGSERIAL PRIMARY KEY,
  assessment_id BIGINT NOT NULL REFERENCES assessment_results(id) ON DELETE CASCADE,
  child_id BIGINT NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  executive_summary TEXT NOT NULL,
  detailed_findings TEXT NOT NULL,
  parent_summary TEXT NOT NULL,
  visual_analytics JSONB,
  educational_resources JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Intervention plans
CREATE TABLE intervention_plans (
  id BIGSERIAL PRIMARY KEY,
  child_id BIGINT NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  assessment_id BIGINT REFERENCES assessment_results(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  priority_goals JSONB NOT NULL,
  intervention_strategies JSONB NOT NULL,
  daily_schedule JSONB NOT NULL,
  parent_training_modules JSONB,
  progress_monitoring JSONB,
  resource_connections JSONB,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused')),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Progress tracking
CREATE TABLE progress_entries (
  id BIGSERIAL PRIMARY KEY,
  intervention_plan_id BIGINT NOT NULL REFERENCES intervention_plans(id) ON DELETE CASCADE,
  child_id BIGINT NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  entry_date DATE NOT NULL,
  goal_id TEXT NOT NULL,
  activity_completed BOOLEAN NOT NULL DEFAULT FALSE,
  observation_notes TEXT,
  skill_level DOUBLE PRECISION,
  behavior_frequency INTEGER,
  milestone_achieved BOOLEAN DEFAULT FALSE,
  video_url TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Care Buddy conversations
CREATE TABLE care_buddy_conversations (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  child_id BIGINT REFERENCES children(id) ON DELETE CASCADE,
  user_role TEXT NOT NULL CHECK (user_role IN ('parent', 'provider', 'admin')),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Care Buddy messages
CREATE TABLE care_buddy_messages (
  id BIGSERIAL PRIMARY KEY,
  conversation_id BIGINT NOT NULL REFERENCES care_buddy_conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  context_data JSONB,
  references JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Clinical protocols library for providers
CREATE TABLE clinical_protocols (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  content TEXT NOT NULL,
  references JSONB,
  evidence_level TEXT CHECK (evidence_level IN ('high', 'moderate', 'low')),
  last_updated DATE NOT NULL,
  keywords TEXT[],
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Patient education library for parents
CREATE TABLE patient_education (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  content TEXT NOT NULL,
  age_range TEXT,
  difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  references JSONB,
  last_updated DATE NOT NULL,
  keywords TEXT[],
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_users_clerk_id ON users(clerk_id);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_children_user_id ON children(user_id);
CREATE INDEX idx_screening_sessions_child_id ON screening_sessions(child_id);
CREATE INDEX idx_screening_sessions_user_id ON screening_sessions(user_id);
CREATE INDEX idx_assessment_results_child_id ON assessment_results(child_id);
CREATE INDEX idx_intervention_plans_child_id ON intervention_plans(child_id);
CREATE INDEX idx_progress_entries_plan_id ON progress_entries(intervention_plan_id);
CREATE INDEX idx_care_buddy_conversations_user_id ON care_buddy_conversations(user_id);
CREATE INDEX idx_care_buddy_messages_conversation_id ON care_buddy_messages(conversation_id);
CREATE INDEX idx_clinical_protocols_category ON clinical_protocols(category);
CREATE INDEX idx_clinical_protocols_keywords ON clinical_protocols USING GIN(keywords);
CREATE INDEX idx_patient_education_category ON patient_education(category);
CREATE INDEX idx_patient_education_keywords ON patient_education USING GIN(keywords);
