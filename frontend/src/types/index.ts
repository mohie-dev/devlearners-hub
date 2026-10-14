export type UserRole = "STUDENT" | "ADMIN";

export type SubjectDepartment = "CS" | "IS" | "IT" | "GENERAL";

export type SubjectLevel = 1 | 2 | 3 | 4;

export type SubjectStatus = "ACTIVE" | "ARCHIVED";

export type AcademicContext = "LECTURE" | "TUTORIAL" | "GENERAL";

export type TaskStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export type TaskProgressStatus = "PENDING" | "COMPLETED";

export type ResourceType = "PDF" | "VIDEO" | "DOCUMENT" | "IMAGE" | "LINK" | "OTHER";

export type ContentSourceType = "UPLOAD" | "EXTERNAL_LINK";

export type ContentStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

// Standard Backend API Response Envelope
export interface ApiResponse<T> {
  status: "success" | "error";
  code: number;
  data: T;
}

export interface ApiErrorResponse {
  status: "error";
  code: number;
  data: {
    message: string | string[];
  };
}

// User / Auth
export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
}

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: string;
  user: AuthUser;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  department: SubjectDepartment | null;
  studyLevel: SubjectLevel | null;
}

// Content Item
export interface ContentItem {
  id: string;
  title: string;
  description: string | null;
  academicContext: AcademicContext;
  resourceType: ResourceType;
  sourceType: ContentSourceType;
  resourceUrl: string | null;
  storageKey: string | null;
  originalFilename: string | null;
  mimeType: string | null;
  sizeBytes: string | null;
  status: ContentStatus;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  subject?: Subject;
}

export interface PaginatedContentResponse {
  items: ContentItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface FilterContentParams {
  subjectId?: string;
  academicContext?: AcademicContext;
  resourceType?: ResourceType;
  search?: string;
  page?: number;
  limit?: number;
}

export interface CreateContentDto {
  title: string;
  description?: string;
  academicContext: AcademicContext;
  resourceType: ResourceType;
  sourceType: ContentSourceType;
  subjectId: string;
  resourceUrl?: string;
  status?: ContentStatus;
}

export interface UpdateContentDto {
  title?: string;
  description?: string | null;
  academicContext?: AcademicContext;
  status?: ContentStatus;
  subjectId?: string;
  resourceUrl?: string;
}

// Subjects
export interface Subject {
  id: string;
  name: string;
  code: string;
  description: string | null;
  status: SubjectStatus;
  level: SubjectLevel;
  department: SubjectDepartment;
  createdAt: string;
  updatedAt: string;
}

export interface FilterSubjectsParams {
  level?: number;
  department?: SubjectDepartment;
  search?: string;
}

export interface CreateSubjectDto {
  name: string;
  code: string;
  description?: string | null;
  level: number;
  department: SubjectDepartment;
}

export interface UpdateSubjectDto {
  name?: string;
  code?: string;
  description?: string | null;
  level?: number;
  department?: SubjectDepartment;
}

// Tasks
export interface TaskResponse {
  id: string;
  title: string;
  description: string | null;
  academicContext: AcademicContext;
  dueAt: string | null;
  status: TaskStatus;
  publishedAt: string | null;
  subjectId: string;
  subjectName?: string;
  relatedContentItemId: string | null;
  createdById: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskDto {
  title: string;
  description?: string | null;
  academicContext?: AcademicContext;
  dueAt?: string | null;
  subjectId: string;
  relatedContentItemId?: string | null;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string | null;
  academicContext?: AcademicContext;
  dueAt?: string | null;
  subjectId?: string;
  relatedContentItemId?: string | null;
  status?: TaskStatus;
}

// Student Tasks (My Tasks)
export interface StudentTaskTaskDetails {
  id: string;
  title: string;
  description: string | null;
  academicContext: AcademicContext;
  dueAt: string | null;
  status: TaskStatus;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  subject: Subject;
  relatedContentItem: ContentItem | null;
}

export interface StudentTask {
  id: string;
  studentId: string;
  taskId: string;
  status: TaskProgressStatus;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  task: StudentTaskTaskDetails;
}

export interface AddStudentTaskDto {
  taskId: string;
}

export interface UpdateStudentTaskProgressDto {
  status: TaskProgressStatus;
}
