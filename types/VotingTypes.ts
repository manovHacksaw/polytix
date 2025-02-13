export const VotingRestriction = {
    OpenToAll: 0,
    Limited: 1,
    RequiredRegistration: 2,
} as const;

export type VotingRestriction = (typeof VotingRestriction)[keyof typeof VotingRestriction];

export const ResultType = {
    RankBased: 0,
    OneWinner: 1,
} as const;

export type ResultType = (typeof ResultType)[keyof typeof ResultType];