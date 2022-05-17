export class Focus {
    id:string;
    name:string;
    description:string;
    childOf:string;
    completedPoints:number;
    targetDate:Date;
    theme:string;
    state:string;
    resolutionDate:Date;
    resolutionReason:string;

    constructor(id:string,name:string,description:string,childOf:string,completedPoints:number,targetDate:Date,theme:string,state:string,resolutionDate:Date,resolutionReason:string) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.childOf = childOf;
        this.completedPoints = completedPoints;
        this.targetDate = targetDate;
        this.theme = theme;
        this.state = state;
        this.resolutionDate = resolutionDate;
        this.resolutionReason = resolutionReason;
    }
}