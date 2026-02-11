import Map "mo:core/Map";
import Set "mo:core/Set";
import Principal "mo:core/Principal";

module {
  type OldServiceRequest = {
    id : Nat;
    customerName : Text;
    contactInfo : Text;
    description : Text;
    status : {
      #submitted;
      #inReview;
      #accepted;
      #inProgress;
      #waitingForParts;
      #completed;
      #shipped;
      #cancelled;
    };
    submittedTime : Int;
    lastUpdatedTime : Int;
    priceEstimate : ?Text;
    publicNotes : [OldNote];
    internalNotes : [OldNote];
    statusHistory : [OldStatusChange];
  };

  type OldNote = {
    author : Text;
    message : Text;
    timestamp : Int;
  };

  type OldStatusChange = {
    status : {
      #submitted;
      #inReview;
      #accepted;
      #inProgress;
      #waitingForParts;
      #completed;
      #shipped;
      #cancelled;
    };
    changedTime : Int;
  };

  type OldActor = {
    nextRequestId : Nat;
    serviceRequests : Map.Map<Nat, OldServiceRequest>;
    userProfiles : Map.Map<Principal, { name : Text; email : ?Text }>;
    adminPrincipals : Set.Set<Principal>;
  };

  type NewServiceRequest = {
    id : Nat;
    customerName : Text;
    contactInfo : Text;
    servicesRequested : [Text];
    totalPriceEstimate : Text;
    description : Text;
    status : {
      #submitted;
      #inReview;
      #accepted;
      #inProgress;
      #waitingForParts;
      #completed;
      #shipped;
      #cancelled;
    };
    submittedTime : Int;
    lastUpdatedTime : Int;
    priceEstimate : ?Text;
    publicNotes : [Note];
    internalNotes : [Note];
    statusHistory : [StatusChange];
  };

  type Note = {
    author : Text;
    message : Text;
    timestamp : Int;
  };

  type StatusChange = {
    status : {
      #submitted;
      #inReview;
      #accepted;
      #inProgress;
      #waitingForParts;
      #completed;
      #shipped;
      #cancelled;
    };
    changedTime : Int;
  };

  type NewActor = {
    nextRequestId : Nat;
    serviceRequests : Map.Map<Nat, NewServiceRequest>;
    userProfiles : Map.Map<Principal, { name : Text; email : ?Text }>;
    adminPrincipals : Set.Set<Principal>;
  };

  public func run(old : OldActor) : NewActor {
    let newRequests = old.serviceRequests.map<Nat, OldServiceRequest, NewServiceRequest>(
      func(_id, oldRequest) {
        {
          id = oldRequest.id;
          customerName = oldRequest.customerName;
          contactInfo = oldRequest.contactInfo;
          servicesRequested = [];
          totalPriceEstimate = "0";
          description = oldRequest.description;
          status = oldRequest.status;
          submittedTime = oldRequest.submittedTime;
          lastUpdatedTime = oldRequest.lastUpdatedTime;
          priceEstimate = oldRequest.priceEstimate;
          publicNotes = oldRequest.publicNotes;
          internalNotes = oldRequest.internalNotes;
          statusHistory = oldRequest.statusHistory;
        };
      }
    );
    {
      old with
      serviceRequests = newRequests;
    };
  };
};
