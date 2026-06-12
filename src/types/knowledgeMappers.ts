import type {
  KnowledgeEntityDTO,
  KnowledgeExclusionReasonCode,
  KnowledgeRelationshipDTO,
  KnowledgeResolveResponseDTO,
  KnowledgeSelectionReasonCode,
} from "./knowledge";

type UnknownRecord = Record<string, unknown>;

const toRecord = (value: unknown): UnknownRecord =>
  (value && typeof value === "object" ? (value as UnknownRecord) : {}) as UnknownRecord;

const toString = (value: unknown, fallback = ""): string =>
  typeof value === "string" ? value : fallback;

const toNumber = (value: unknown, fallback = 0): number =>
  typeof value === "number" && Number.isFinite(value) ? value : fallback;

const toStringArray = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];

export const mapKnowledgeEntityFromApi = (value: unknown): KnowledgeEntityDTO => {
  const row = toRecord(value);
  const visibility = toRecord(row.visibility);
  const source = toRecord(row.source);
  const quality = toRecord(row.quality);
  const lifecycle = toRecord(row.lifecycle);
  const timestamps = toRecord(row.timestamps);

  return {
    entityId: toString(row.entity_id),
    tenantId: toString(row.tenant_id),
    orgId: toString(row.org_id),
    kind: toString(row.kind) as KnowledgeEntityDTO["kind"],
    kindSchemaVersion: toString(row.kind_schema_version, "v1"),
    title: toString(row.title),
    summary: toString(row.summary),
    tags: toStringArray(row.tags),
    contexts: toStringArray(row.contexts),
    facets: toRecord(row.facets),
    owners: Array.isArray(row.owners) ? (row.owners as KnowledgeEntityDTO["owners"]) : [],
    visibility: {
      scope: toString(visibility.scope, "restricted") as KnowledgeEntityDTO["visibility"]["scope"],
      aclPolicyId: toString(visibility.acl_policy_id),
      orgId: toString(visibility.org_id) || undefined,
      teamId: toString(visibility.team_id) || undefined,
      groupId: toString(visibility.group_id) || undefined,
      userId: toString(visibility.user_id) || undefined,
      userIds: toStringArray(visibility.user_ids),
      ownerUserId: toString(visibility.owner_user_id) || undefined,
      requireMembership: Boolean(visibility.require_membership),
      sensitivityTags: toStringArray(visibility.sensitivity_tags),
    },
    source: {
      sourceSystem: toString(source.source_system),
      sourceId: toString(source.source_id),
      externalRef: toString(source.external_ref) || undefined,
      sourceOfTruth: Boolean(source.source_of_truth),
      dedupeKey: toString(source.dedupe_key) || undefined,
    },
    contentRefs: Array.isArray(row.content_refs)
      ? (row.content_refs as KnowledgeEntityDTO["contentRefs"])
      : [],
    quality: {
      confidence: toNumber(quality.confidence, 0),
      verificationState: toString(quality.verification_state, "asserted") as KnowledgeEntityDTO["quality"]["verificationState"],
      evidenceRefs: toStringArray(quality.evidence_refs),
    },
    lifecycle: {
      status: toString(lifecycle.status, "active") as KnowledgeEntityDTO["lifecycle"]["status"],
      effectiveFrom: (lifecycle.effective_from as string | null) ?? null,
      effectiveTo: (lifecycle.effective_to as string | null) ?? null,
      stalenessTtlSeconds: toNumber(lifecycle.staleness_ttl_seconds, 0),
    },
    timestamps: {
      createdAt: toString(timestamps.created_at),
      updatedAt: toString(timestamps.updated_at),
      observedAt: toString(timestamps.observed_at),
      effectiveFrom: (timestamps.effective_from as string | null) ?? null,
      effectiveTo: (timestamps.effective_to as string | null) ?? null,
    },
    kindPayload: toRecord(row.kind_payload),
    schemaVersion: toString(row.schema_version, "v1"),
  };
};

export const mapKnowledgeRelationshipFromApi = (value: unknown): KnowledgeRelationshipDTO => {
  const row = toRecord(value);
  const visibility = toRecord(row.visibility);
  const source = toRecord(row.source);
  const timestamps = toRecord(row.timestamps);

  return {
    relationshipId: toString(row.relationship_id),
    tenantId: toString(row.tenant_id),
    orgId: toString(row.org_id),
    fromEntityId: toString(row.from_entity_id),
    toEntityId: toString(row.to_entity_id),
    relationshipType: toString(row.relationship_type) as KnowledgeRelationshipDTO["relationshipType"],
    directionality: toString(row.directionality, "directed") as KnowledgeRelationshipDTO["directionality"],
    weight: toNumber(row.weight, 1),
    facets: toRecord(row.facets),
    evidence: Array.isArray(row.evidence) ? (row.evidence as KnowledgeRelationshipDTO["evidence"]) : [],
    visibility: {
      scope: toString(visibility.scope, "restricted") as KnowledgeRelationshipDTO["visibility"]["scope"],
      aclPolicyId: toString(visibility.acl_policy_id),
      orgId: toString(visibility.org_id) || undefined,
      teamId: toString(visibility.team_id) || undefined,
      groupId: toString(visibility.group_id) || undefined,
      userId: toString(visibility.user_id) || undefined,
      userIds: toStringArray(visibility.user_ids),
      ownerUserId: toString(visibility.owner_user_id) || undefined,
      requireMembership: Boolean(visibility.require_membership),
      sensitivityTags: toStringArray(visibility.sensitivity_tags),
    },
    source: {
      sourceSystem: toString(source.source_system),
      sourceId: toString(source.source_id),
      externalRef: toString(source.external_ref) || undefined,
      sourceOfTruth: Boolean(source.source_of_truth),
      dedupeKey: toString(source.dedupe_key) || undefined,
    },
    timestamps: {
      createdAt: toString(timestamps.created_at),
      updatedAt: toString(timestamps.updated_at),
      observedAt: toString(timestamps.observed_at),
      effectiveFrom: (timestamps.effective_from as string | null) ?? null,
      effectiveTo: (timestamps.effective_to as string | null) ?? null,
    },
    schemaVersion: toString(row.schema_version, "v1"),
  };
};

export const mapKnowledgeResolveFromApi = (value: unknown): KnowledgeResolveResponseDTO => {
  const row = toRecord(value);
  const cache = toRecord(row.cache);
  const tiers = toRecord(row.tiers);
  const toSources = (input: unknown): KnowledgeResolveResponseDTO["sources"] => {
    if (!Array.isArray(input)) return [];
    return input.map((item) => {
      const source = toRecord(item);
      return {
        entityId: toString(source.entity_id),
        kind: toString(source.kind) as KnowledgeResolveResponseDTO["sources"][number]["kind"],
        title: toString(source.title),
        score: toNumber(source.score, 0),
        selectionReasonCode: toString(source.selection_reason_code) as KnowledgeSelectionReasonCode,
        selectionReasonShort: toString(source.selection_reason_short),
        primaryPath: Array.isArray(source.primary_path)
          ? (source.primary_path as Array<{ from: string; rel: string; to: string }>)
          : [],
      };
    });
  };

  return {
    bundleId: toString(row.bundle_id),
    graphVersion: toString(row.graph_version),
    cache: {
      hit: Boolean(cache.hit),
      cacheKey: toString(cache.cache_key),
      ttlSeconds: toNumber(cache.ttl_seconds, 0),
    },
    tiers: {
      constraints: toSources(tiers.constraints),
      coreEvidence: toSources(tiers.core_evidence),
      supplemental: toSources(tiers.supplemental),
    },
    sources: toSources(row.sources),
    provenance: Array.isArray(row.provenance)
      ? (row.provenance as KnowledgeResolveResponseDTO["provenance"])
      : [],
    inferredTags: toStringArray(row.inferred_tags),
    inferredContexts: toStringArray(row.inferred_contexts),
    exclusionReport: Array.isArray(row.exclusion_report)
      ? row.exclusion_report.map((item) => {
          const exclusion = toRecord(item);
          return {
            entityId: toString(exclusion.entity_id),
            reason: toString(exclusion.reason) as KnowledgeExclusionReasonCode,
          };
        })
      : [],
    summary: {
      selectedNodes: toNumber(toRecord(row.summary).selected_nodes, 0),
      selectedEdges: toNumber(toRecord(row.summary).selected_edges, 0),
      maxTokens: toNumber(toRecord(row.summary).max_tokens, 0),
    },
  };
};
