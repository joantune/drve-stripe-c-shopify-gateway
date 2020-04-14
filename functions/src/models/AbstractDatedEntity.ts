export interface AbstractDatedEntity {
  createdAt: Date;
  updatedAt: Date;
}

export abstract class AbstractDatedEntityImp implements  AbstractDatedEntity{

  protected preSave(){
    this.updatedAt = new Date();
  }

  createdAt!: Date;
  updatedAt!: Date;
}