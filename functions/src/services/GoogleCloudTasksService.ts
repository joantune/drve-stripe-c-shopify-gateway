import * as jwt from "jsonwebtoken";
import {logger} from "../utils/logger";
import {constants, portURIStringOrEmpty} from "../conf/constants";
import {prettyPrint} from "../utils/utils";
import {ReportingRequest} from "../models/DTOs/ReportingRequest";
import {ReportableEntity} from "../models/ReportableEntity";
const tasks = require("@google-cloud/tasks");

export enum AvailableGCloudQueues  {
  processMerchantStatus = "processMerchantStatus",
  processTransaction = "processTransaction"

}
import {PROCESSOR_BASE_PATH} from "../controllers/processorController";

export const enqueueUpdate = async function<T extends ReportableEntity> (
    codedObj: ReportingRequest<T>,
    queue: AvailableGCloudQueues,
    from?: string,
    inSeconds: number = 2
): Promise<any> {
  try {
    const LOG = logger('enqueueUpdate');
    const project = constants.project;
    const location = "europe-west1";
    const endpoint = `${PROCESSOR_BASE_PATH}/${queue}`;

    const code = Buffer.from(
        jwt.sign( Object.assign({},codedObj), constants.jwtSecret, {
          expiresIn: "35 days"
        })
    ).toString("base64");
    LOG.info(`Enqueueing the update of ${prettyPrint(codedObj)}\n
     Endpoint: ${endpoint} - from: ${from}`);

    //probably we'll need at least the credentials
    const gcClient = new tasks.CloudTasksClient({});
    const parent = gcClient.queuePath(project, location, queue.toString());
    let url = `${constants.schema}://${
        constants.defaultRequestHost
        }${portURIStringOrEmpty()}${constants.basePath}${endpoint}?code=${code}`;
    if (from != null) {
      url = `${url}&from=${encodeURIComponent(from)}`;
    }

    const taskEnqueueResult = <Promise<any>>gcClient.createTask({
      parent: parent,
      task: {
        httpRequest: {
          httpMethod: "GET",
          url: url
        },
        scheduleTime: {
          seconds: inSeconds + Date.now() / 1000
        }
      }
    });
    return taskEnqueueResult;

  } catch (err) {
    return Promise.reject(err);
  }
};