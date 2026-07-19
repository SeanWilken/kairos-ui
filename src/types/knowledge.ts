import type { DocumentDescriptor } from "./documents";

export type KnowledgeEntityKind =
  | "persona"
  | "user"
  | "team"
  | "project"
  | "task"
  | "document"
  | "file"
  | "symbol"
  | "tool"
  | "workflow"
  | "service"
  | "policy"
  | "repo"
  | "workspace";

export type KnowledgeVisibilityScope =
  | "private"
  | "user"
  | "group"
  | "team"
  | "org"
  | "tenant"
  | "restricted";

export type KnowledgeVerificationState = "asserted" | "derived" | "verified";

export type KnowledgeLifecycleStatus = "active" | "deprecated" | "archived" | "deleted";

export type KnowledgeRelationshipType =
  | "contains"
  | "parent_of"
  | "depends_on"
  | "imports"
  | "implements"
  | "exposes_contract"
  | "consumed_by"
  | "uses_tool"
  | "governed_by"
  | "restricted_by"
  | "requires_permission"
  | "escalates_to"
  | "expert_in"
  | "related_to"
  | "blocks";

export type KnowledgeDirectionality = "directed" | "bidirectional";

export type KnowledgeSelectionReasonCode =
  | "semantic_match"
  | "policy_priority"
  | "graph_proximity"
  | "owner_authority"
  | "freshness_boost";

export type KnowledgeExclusionReasonCode =
  | "acl_denied"
  | "edge_acl_denied"
  | "stale"
  | "low_score"
  | "budget_exceeded"
  | "scope_filtered"
  | "conflict_lost";

export type KnowledgeOwnerRefDTO = {
  ownerType: "user" | "team" | "service";
  ownerId: string;
};

export type KnowledgeVisibilityDTO = {
  scope: KnowledgeVisibilityScope;
  aclPolicyId: string;
  orgId?: string;
  teamId?: string;
  groupId?: string;
  userId?: string;
  userIds?: string[];
  ownerUserId?: string;
  requireMembership?: boolean;
  sensitivityTags?: string[];
};

export type KnowledgeSourceDTO = {
  sourceSystem: string;
  sourceId: string;
  externalRef?: string;
  sourceOfTruth: boolean;
  dedupeKey?: string;
};

export type KnowledgeContentRefDTO = {
  refType: "uri" | "repo_path" | "artifact_id" | "blob_id";
  ref: string;
  snippet?: string;
  checksum?: string;
};

export type KnowledgeQualityDTO = {
  confidence: number;
  verificationState: KnowledgeVerificationState;
  evidenceRefs: string[];
};

export type KnowledgeLifecycleDTO = {
  status: KnowledgeLifecycleStatus;
  effectiveFrom: string | null;
  effectiveTo: string | null;
  stalenessTtlSeconds: number;
};

export type KnowledgeTimestampsDTO = {
  createdAt: string;
  updatedAt: string;
  observedAt: string;
  effectiveFrom: string | null;
  effectiveTo: string | null;
};

export type KnowledgeEntityDTO = {
  entityId: string;
  tenantId: string;
  orgId: string;
  kind: KnowledgeEntityKind;
  kindSchemaVersion: string;
  title: string;
  summary: string;
  tags: string[];
  contexts: string[];
  facets: Record<string, unknown>;
  owners: KnowledgeOwnerRefDTO[];
  visibility: KnowledgeVisibilityDTO;
  source: KnowledgeSourceDTO;
  contentRefs: KnowledgeContentRefDTO[];
  relatedDocuments?: DocumentDescriptor[];
  quality: KnowledgeQualityDTO;
  lifecycle: KnowledgeLifecycleDTO;
  timestamps: KnowledgeTimestampsDTO;
  kindPayload: Record<string, unknown>;
  schemaVersion: string;
};

export type KnowledgeRelationshipDTO = {
  relationshipId: string;
  tenantId: string;
  orgId: string;
  fromEntityId: string;
  toEntityId: string;
  relationshipType: KnowledgeRelationshipType;
  directionality: KnowledgeDirectionality;
  weight: number;
  facets: Record<string, unknown>;
  evidence: Array<{ evidenceType?: string; ref?: string }>;
  visibility: KnowledgeVisibilityDTO;
  source: KnowledgeSourceDTO;
  timestamps: KnowledgeTimestampsDTO;
  schemaVersion: string;
};

export type KnowledgeResolveRequestDTO = {
  anchor: {
    entityId?: string;
    text?: string;
  };
  lens: {
    audience?: string;
    channelProfileId?: string;
    radiusUp?: number;
    radiusDown?: number;
    includeNodeKinds?: KnowledgeEntityKind[];
    includeRelationshipTypes?: KnowledgeRelationshipType[];
    repoScope?: string[];
  };
  filters?: {
    tagsAny?: string[];
    facets?: Record<string, unknown>;
  };
  budget: {
    maxNodes: number;
    maxEdges: number;
    maxSnippets: number;
    maxTokens: number;
  };
  options?: {
    includeExclusionReport?: boolean;
    includeProvenancePaths?: boolean;
    allowCached?: boolean;
  };
};

export type KnowledgeResolveSourceDTO = {
  entityId: string;
  kind: KnowledgeEntityKind;
  title: string;
  score: number;
  selectionReasonCode: KnowledgeSelectionReasonCode;
  selectionReasonShort: string;
  primaryPath: Array<{ from: string; rel: string; to: string }>;
};

export type KnowledgeResolveResponseDTO = {
  bundleId: string;
  graphVersion: string;
  cache: {
    hit: boolean;
    cacheKey: string;
    ttlSeconds: number;
  };
  tiers: {
    constraints: KnowledgeResolveSourceDTO[];
    coreEvidence: KnowledgeResolveSourceDTO[];
    supplemental: KnowledgeResolveSourceDTO[];
  };
  sources: KnowledgeResolveSourceDTO[];
  provenance: Array<{
    entityId: string;
    selectionReason: string;
    path: Array<{ from: string; rel: string; to: string }>;
    scores: Record<string, number>;
  }>;
  inferredTags: string[];
  inferredContexts: string[];
  exclusionReport: Array<{ entityId: string; reason: KnowledgeExclusionReasonCode }>;
  summary: {
    selectedNodes: number;
    selectedEdges: number;
    maxTokens: number;
  };
};
export type NodeType =
  | "document"
  | "concept"
  | "decision"
  | "person"
  | "action"
  | "question"
  | "evidence"
  | "hypothesis"
  | "index";

export type RelationType =
  | "references"
  | "contradicts"
  | "supports"
  | "extends"
  | "is_a"
  | "part_of"
  | "authored_by"
  | "derived_from"
  | "indexed_by";

export type FederatedSourceType = "api" | "database" | "file" | "web" | "manual";

export type NodeFilterType = NodeType | "all";

export type GraphLayout = "auto" | "manual";

export interface FederatedSource {
  id: string;
  name: string;
  type: FederatedSourceType;
  syncedAt?: string;
  url?: string;
}

export interface KnowledgeTag {
  id: string;
  label: string;
  color?: string;
}

export interface KnowledgeGraphNode {
  id: string;
  type: NodeType;
  title: string;
  summary?: string;
  content?: string;
  tags: KnowledgeTag[];
  source?: FederatedSource;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt?: string;
  confidence?: number;
  position?: { x: number; y: number };
}

export interface NodeRelation {
  id: string;
  sourceId: string;
  targetId: string;
  type: RelationType;
  label?: string;
  weight?: number;
  metadata?: Record<string, unknown>;
}

export interface KnowledgeGraphData {
  nodes: KnowledgeGraphNode[];
  relations: NodeRelation[];
}
