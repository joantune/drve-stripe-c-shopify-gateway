export interface IReportableEntity {
  reportedAt?: Date; //Date where it was reported to
  reportedTo?: string; //URL it was reported to

  reportBody?: string; //any kind of body that we got back from the response
  reportHeaders?: string; //all headers taht we got back from the response

}

export abstract class ReportableEntity implements IReportableEntity{
  reportBody?: string;
  reportHeaders?: string;
  reportedAt?: Date;
  reportedTo?: string;





}