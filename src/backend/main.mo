import Map "mo:core/Map";
import Set "mo:core/Set";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Text "mo:core/Text";
import List "mo:core/List";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";


actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type UserProfile = {
    name : Text;
    email : ?Text;
  };

  public type ServiceRequest = {
    id : Nat;
    customerName : Text;
    contactInfo : Text;
    servicesRequested : [Text];
    totalPriceEstimate : Text;
    description : Text;
    status : RequestStatus;
    submittedTime : Int;
    lastUpdatedTime : Int;
    priceEstimate : ?Text;
    publicNotes : [Note];
    internalNotes : [Note];
    statusHistory : [StatusChange];
  };

  public type PublicServiceRequest = {
    id : Nat;
    customerName : Text;
    contactInfo : Text;
    servicesRequested : [Text];
    totalPriceEstimate : Text;
    description : Text;
    status : RequestStatus;
    submittedTime : Int;
    lastUpdatedTime : Int;
    publicNotes : [Note];
    statusHistory : [StatusChange];
  };

  public type Note = {
    author : Text;
    message : Text;
    timestamp : Int;
  };

  public type StatusChange = {
    status : RequestStatus;
    changedTime : Int;
  };

  public type RequestStatus = {
    #submitted;
    #inReview;
    #accepted;
    #inProgress;
    #waitingForParts;
    #completed;
    #shipped;
    #cancelled;
  };

  module RequestStatus {
    public func compare(status1 : RequestStatus, status2 : RequestStatus) : Order.Order {
      func statusOrder(status : RequestStatus) : Nat {
        switch (status) {
          case (#submitted) { 1 };
          case (#inReview) { 2 };
          case (#accepted) { 3 };
          case (#inProgress) { 4 };
          case (#waitingForParts) { 5 };
          case (#completed) { 6 };
          case (#shipped) { 7 };
          case (#cancelled) { 8 };
        };
      };

      Nat.compare(statusOrder(status1), statusOrder(status2));
    };
  };

  var nextRequestId = 1;
  let serviceRequests = Map.empty<Nat, ServiceRequest>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  let adminPrincipals = Set.empty<Principal>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func createServiceRequest(
    customerName : Text,
    contactInfo : Text,
    servicesRequested : [Text],
    totalPriceEstimate : Text,
    description : Text,
  ) : async Nat {
    let newId = nextRequestId;
    nextRequestId += 1;

    let currentTime = Time.now();

    let newRequest : ServiceRequest = {
      id = newId;
      customerName;
      contactInfo;
      servicesRequested;
      totalPriceEstimate;
      description;
      status = #submitted;
      submittedTime = currentTime;
      lastUpdatedTime = currentTime;
      priceEstimate = null;
      publicNotes = [];
      internalNotes = [];
      statusHistory = [
        {
          status = #submitted;
          changedTime = currentTime;
        },
      ];
    };

    serviceRequests.add(newId, newRequest);
    newId;
  };

  private func toPublicRequest(request : ServiceRequest) : PublicServiceRequest {
    {
      id = request.id;
      customerName = request.customerName;
      contactInfo = request.contactInfo;
      servicesRequested = request.servicesRequested;
      totalPriceEstimate = request.totalPriceEstimate;
      description = request.description;
      status = request.status;
      submittedTime = request.submittedTime;
      lastUpdatedTime = request.lastUpdatedTime;
      publicNotes = request.publicNotes;
      statusHistory = request.statusHistory;
    };
  };

  public query ({ caller }) func getServiceRequest(requestId : Nat) : async ?PublicServiceRequest {
    switch (serviceRequests.get(requestId)) {
      case (null) { null };
      case (?request) {
        ?toPublicRequest(request);
      };
    };
  };

  public shared ({ caller }) func getFullServiceRequest(requestId : Nat) : async ?ServiceRequest {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can view full request details");
    };
    serviceRequests.get(requestId);
  };

  public shared ({ caller }) func getServiceRequestsByStatus(status : RequestStatus) : async [ServiceRequest] {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can list requests by status");
    };

    let requests = serviceRequests.values().toArray();
    requests.filter(
      func(request) {
        request.status == status;
      }
    );
  };

  public shared ({ caller }) func getAllServiceRequests() : async [ServiceRequest] {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can list all requests");
    };

    serviceRequests.values().toArray();
  };

  public shared ({ caller }) func updateRequestStatus(requestId : Nat, newStatus : RequestStatus) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can update request status");
    };

    switch (serviceRequests.get(requestId)) {
      case (null) {
        Runtime.trap("Service request not found");
      };
      case (?request) {
        let currentTime = Time.now();

        let newStatusChange : StatusChange = {
          status = newStatus;
          changedTime = currentTime;
        };

        let updatedHistory = [newStatusChange].concat(request.statusHistory);

        let updatedRequest : ServiceRequest = {
          id = request.id;
          customerName = request.customerName;
          contactInfo = request.contactInfo;
          servicesRequested = request.servicesRequested;
          totalPriceEstimate = request.totalPriceEstimate;
          description = request.description;
          status = newStatus;
          submittedTime = request.submittedTime;
          lastUpdatedTime = currentTime;
          priceEstimate = request.priceEstimate;
          publicNotes = request.publicNotes;
          internalNotes = request.internalNotes;
          statusHistory = updatedHistory;
        };

        serviceRequests.add(requestId, updatedRequest);
      };
    };
  };

  public shared ({ caller }) func addNote(
    requestId : Nat,
    noteType : {
      #display;
      #internal;
    },
    author : Text,
    message : Text,
  ) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can add notes");
    };

    switch (serviceRequests.get(requestId)) {
      case (null) {
        Runtime.trap("Service request not found");
      };
      case (?request) {
        let newNote : Note = {
          author;
          message;
          timestamp = Time.now();
        };

        let updatedRequest : ServiceRequest = switch (noteType) {
          case (#display) {
            let updatedPublicNotes = [newNote].concat(request.publicNotes);
            {
              id = request.id;
              customerName = request.customerName;
              contactInfo = request.contactInfo;
              servicesRequested = request.servicesRequested;
              totalPriceEstimate = request.totalPriceEstimate;
              description = request.description;
              status = request.status;
              submittedTime = request.submittedTime;
              lastUpdatedTime = Time.now();
              priceEstimate = request.priceEstimate;
              publicNotes = updatedPublicNotes;
              internalNotes = request.internalNotes;
              statusHistory = request.statusHistory;
            };
          };
          case (#internal) {
            let updatedInternalNotes = [newNote].concat(request.internalNotes);
            {
              id = request.id;
              customerName = request.customerName;
              contactInfo = request.contactInfo;
              servicesRequested = request.servicesRequested;
              totalPriceEstimate = request.totalPriceEstimate;
              description = request.description;
              status = request.status;
              submittedTime = request.submittedTime;
              lastUpdatedTime = Time.now();
              priceEstimate = request.priceEstimate;
              publicNotes = request.publicNotes;
              internalNotes = updatedInternalNotes;
              statusHistory = request.statusHistory;
            };
          };
        };

        serviceRequests.add(requestId, updatedRequest);
      };
    };
  };

  public query ({ caller }) func compareStatus(status1 : RequestStatus, status2 : RequestStatus) : async Order.Order {
    RequestStatus.compare(status1, status2 : RequestStatus);
  };

  public query ({ caller }) func getRequestsByStatus(status : RequestStatus) : async [ServiceRequest] {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can list requests by status");
    };

    let filteredRequests = List.empty<ServiceRequest>();

    for ((_, request) in serviceRequests.entries()) {
      if (request.status == status) {
        filteredRequests.add(request);
      };
    };

    return filteredRequests.toArray();
  };
};
