import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ServiceRequest {
    id: bigint;
    customerName: string;
    status: RequestStatus;
    submittedTime: bigint;
    contactInfo: string;
    description: string;
    statusHistory: Array<StatusChange>;
    priceEstimate?: string;
    servicesRequested: Array<string>;
    totalPriceEstimate: string;
    lastUpdatedTime: bigint;
    internalNotes: Array<Note>;
    publicNotes: Array<Note>;
}
export interface Note {
    author: string;
    message: string;
    timestamp: bigint;
}
export interface StatusChange {
    status: RequestStatus;
    changedTime: bigint;
}
export interface UserProfile {
    name: string;
    email?: string;
}
export interface PublicServiceRequest {
    id: bigint;
    customerName: string;
    status: RequestStatus;
    submittedTime: bigint;
    contactInfo: string;
    description: string;
    statusHistory: Array<StatusChange>;
    servicesRequested: Array<string>;
    totalPriceEstimate: string;
    lastUpdatedTime: bigint;
    publicNotes: Array<Note>;
}
export enum Order {
    less = "less",
    equal = "equal",
    greater = "greater"
}
export enum RequestStatus {
    shipped = "shipped",
    cancelled = "cancelled",
    submitted = "submitted",
    completed = "completed",
    waitingForParts = "waitingForParts",
    inReview = "inReview",
    accepted = "accepted",
    inProgress = "inProgress"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum Variant_internal_display {
    internal = "internal",
    display = "display"
}
export interface backendInterface {
    addNote(requestId: bigint, noteType: Variant_internal_display, author: string, message: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    compareStatus(status1: RequestStatus, status2: RequestStatus): Promise<Order>;
    createServiceRequest(customerName: string, contactInfo: string, servicesRequested: Array<string>, totalPriceEstimate: string, description: string): Promise<bigint>;
    getAllServiceRequests(): Promise<Array<ServiceRequest>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getFullServiceRequest(requestId: bigint): Promise<ServiceRequest | null>;
    getRequestsByStatus(status: RequestStatus): Promise<Array<ServiceRequest>>;
    getServiceRequest(requestId: bigint): Promise<PublicServiceRequest | null>;
    getServiceRequestsByStatus(status: RequestStatus): Promise<Array<ServiceRequest>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateRequestStatus(requestId: bigint, newStatus: RequestStatus): Promise<void>;
}
