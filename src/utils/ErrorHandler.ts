class Errorhandler extends Error {
      statuscode : number;
      message :string;
    constructor(statuscode :number,message:string ){
        super(message);
        this.statuscode=statuscode;
        this.message=message;
        Error.captureStackTrace(this,this.constructor);
    }
}

export default Errorhandler;
