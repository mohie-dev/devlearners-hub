export enum UserRole {
  STUDENT = 'STUDENT',
  ADMIN = 'ADMIN',
}

export enum SubjectStatus {
    ACTIVE = 'ACTIVE',
    ARCHIVED = 'ARCHIVED',
}

export enum AcademicContext {
    LECTURE = 'LECTURE',
    TUTORIAL = 'TUTORIAL',
    GENERAL = 'GENERAL',
}

export enum ResourceType {
    PDF = 'PDF',
    VIDEO = 'VIDEO',
    DOCUMENT = 'DOCUMENT',
    IMAGE = 'IMAGE',
    LINK = 'LINK',
    OTHER = 'OTHER',
}

export enum ContentSourceType {
    UPLOAD = 'UPLOAD',
    EXTERNAL_LINK = 'EXTERNAL_LINK',
}

export enum ContentStatus {
    DRAFT = 'DRAFT',
    PUBLISHED = 'PUBLISHED',
    ARCHIVED = 'ARCHIVED',
}

export enum TaskStatus {
    DRAFT = 'DRAFT',
    PUBLISHED = 'PUBLISHED',
    ARCHIVED = 'ARCHIVED',
}

export enum TaskProgressStatus {
    PENDING = 'PENDING',
    COMPLETED = 'COMPLETED',
}
