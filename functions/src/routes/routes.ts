/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { Controller, ValidationService, FieldErrors, ValidateError, TsoaRoute } from 'tsoa';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { MerchantsController } from './../controllers/MerchantsController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { MerchantsCreateController } from './../controllers/MerchantsController';
import { expressAuthentication } from './../auth/authentication';
import * as express from 'express';

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
    "Status": {
        "dataType": "refEnum",
        "enums": ["Stripe_waiting", "Active", "Inactive", "Stripe_inactive"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Partial_MerchantOutputInstance_": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "chargeWebhookUrl": { "dataType": "string", "default": "" }, "commissionPercentage": { "dataType": "double", "default": 0 }, "connectedAccountWebhookUrl": { "dataType": "string", "default": "" }, "createdAt": { "dataType": "datetime", "default": "2020-04-16T10:05:48.125Z" }, "drveUid": { "dataType": "string", "default": "" }, "enabled": { "dataType": "boolean", "default": false }, "gatewayAccountId": { "dataType": "string", "default": "" }, "gatewayCredentials": { "dataType": "string", "default": "" }, "gatewayURL": { "dataType": "string", "default": "" }, "id": { "dataType": "string", "default": "" }, "name": { "dataType": "string", "default": "" }, "shopifyDomain": { "dataType": "string", "default": "" }, "status": { "ref": "Status" }, "stripeAcctId": { "dataType": "string", "default": "" }, "stripeOnConnectionRedirectURL": { "dataType": "string", "default": "" }, "stripeURLToConnectAccount": { "dataType": "string", "default": "" }, "testMode": { "dataType": "boolean", "default": true }, "updatedAt": { "dataType": "datetime", "default": "2020-04-16T10:05:48.127Z" } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Partial_MerchantOutput_": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "status": { "ref": "Status" }, "gatewayURL": { "dataType": "string" }, "gatewayAccountId": { "dataType": "string" }, "gatewayCredentials": { "dataType": "string" }, "stripeAcctId": { "dataType": "string" }, "stripeURLToConnectAccount": { "dataType": "string" }, "testMode": { "dataType": "boolean" }, "drveUid": { "dataType": "string" }, "shopifyDomain": { "dataType": "string" }, "commissionPercentage": { "dataType": "double" }, "enabled": { "dataType": "boolean" }, "name": { "dataType": "string" }, "chargeWebhookUrl": { "dataType": "string" }, "connectedAccountWebhookUrl": { "dataType": "string" }, "stripeOnConnectionRedirectURL": { "dataType": "string" }, "id": { "dataType": "string" }, "createdAt": { "dataType": "datetime" }, "updatedAt": { "dataType": "datetime" } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "MerchantOutput": {
        "dataType": "refObject",
        "properties": {
            "drveUid": { "dataType": "string", "required": true },
            "shopifyDomain": { "dataType": "string", "required": true },
            "commissionPercentage": { "dataType": "double", "required": true },
            "enabled": { "dataType": "boolean", "required": true },
            "name": { "dataType": "string", "required": true },
            "chargeWebhookUrl": { "dataType": "string", "required": true },
            "connectedAccountWebhookUrl": { "dataType": "string", "required": true },
            "stripeOnConnectionRedirectURL": { "dataType": "string", "required": true },
            "id": { "dataType": "string", "required": true },
            "createdAt": { "dataType": "datetime", "required": true },
            "updatedAt": { "dataType": "datetime", "required": true },
            "status": { "ref": "Status", "required": true },
            "gatewayURL": { "dataType": "string", "required": true },
            "gatewayAccountId": { "dataType": "string", "required": true },
            "gatewayCredentials": { "dataType": "string", "required": true },
            "stripeAcctId": { "dataType": "string", "required": true },
            "stripeURLToConnectAccount": { "dataType": "string", "required": true },
            "testMode": { "dataType": "boolean", "required": true },
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "MerchantInput": {
        "dataType": "refObject",
        "properties": {
            "drveUid": { "dataType": "string", "required": true },
            "shopifyDomain": { "dataType": "string", "required": true },
            "commissionPercentage": { "dataType": "double", "required": true },
            "enabled": { "dataType": "boolean", "required": true },
            "name": { "dataType": "string", "required": true },
            "chargeWebhookUrl": { "dataType": "string", "required": true },
            "connectedAccountWebhookUrl": { "dataType": "string", "required": true },
            "stripeOnConnectionRedirectURL": { "dataType": "string", "required": true },
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const validationService = new ValidationService(models);

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

export function RegisterRoutes(app: express.Express) {
    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################
    app.get('/v1/merchants',
        authenticateMiddleware([{ "api_key": [] }]),
        function(request: any, response: any, next: any) {
            const args = {
                req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new MerchantsController();


            const promise = controller.getMerchants.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/v1/merchants/:drveUid',
        authenticateMiddleware([{ "api_key": [] }]),
        function(request: any, response: any, next: any) {
            const args = {
                req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
                drveUid: { "in": "path", "name": "drveUid", "required": true, "dataType": "string" },
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new MerchantsController();


            const promise = controller.getMerchant.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/v1/merchants',
        authenticateMiddleware([{ "api_key": [] }]),
        function(request: any, response: any, next: any) {
            const args = {
                merchantInput: { "in": "body", "name": "merchantInput", "required": true, "ref": "MerchantInput" },
                req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new MerchantsController();


            const promise = controller.createMerchant.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/v1/merchantsCreate',
        function(request: any, response: any, next: any) {
            const args = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new MerchantsCreateController();


            const promise = controller.createMerchants.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function authenticateMiddleware(security: TsoaRoute.Security[] = []) {
        return (request: any, _response: any, next: any) => {
            let responded = 0;
            let success = false;

            const succeed = function(user: any) {
                if (!success) {
                    success = true;
                    responded++;
                    request['user'] = user;
                    next();
                }
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            const fail = function(error: any) {
                responded++;
                if (responded == security.length && !success) {
                    error.status = error.status || 401;
                    next(error)
                }
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            for (const secMethod of security) {
                if (Object.keys(secMethod).length > 1) {
                    let promises: Promise<any>[] = [];

                    for (const name in secMethod) {
                        promises.push(expressAuthentication(request, name, secMethod[name]));
                    }

                    Promise.all(promises)
                        .then((users) => { succeed(users[0]); })
                        .catch(fail);
                } else {
                    for (const name in secMethod) {
                        expressAuthentication(request, name, secMethod[name])
                            .then(succeed)
                            .catch(fail);
                    }
                }
            }
        }
    }

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function isController(object: any): object is Controller {
        return 'getHeaders' in object && 'getStatus' in object && 'setStatus' in object;
    }

    function promiseHandler(controllerObj: any, promise: any, response: any, next: any) {
        return Promise.resolve(promise)
            .then((data: any) => {
                let statusCode;
                if (isController(controllerObj)) {
                    const headers = controllerObj.getHeaders();
                    Object.keys(headers).forEach((name: string) => {
                        response.set(name, headers[name]);
                    });

                    statusCode = controllerObj.getStatus();
                }

                // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

                if (data && typeof data.pipe === 'function' && data.readable && typeof data._read === 'function') {
                    data.pipe(response);
                } else if (data || data === false) { // === false allows boolean result
                    response.status(statusCode || 200).json(data);
                } else {
                    response.status(statusCode || 204).end();
                }
            })
            .catch((error: any) => next(error));
    }

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function getValidatedArgs(args: any, request: any): any[] {
        const fieldErrors: FieldErrors = {};
        const values = Object.keys(args).map((key) => {
            const name = args[key].name;
            switch (args[key].in) {
                case 'request':
                    return request;
                case 'query':
                    return validationService.ValidateParam(args[key], request.query[name], name, fieldErrors, undefined, { "specVersion": 3 });
                case 'path':
                    return validationService.ValidateParam(args[key], request.params[name], name, fieldErrors, undefined, { "specVersion": 3 });
                case 'header':
                    return validationService.ValidateParam(args[key], request.header(name), name, fieldErrors, undefined, { "specVersion": 3 });
                case 'body':
                    return validationService.ValidateParam(args[key], request.body, name, fieldErrors, undefined, { "specVersion": 3 });
                case 'body-prop':
                    return validationService.ValidateParam(args[key], request.body[name], name, fieldErrors, 'body.', { "specVersion": 3 });
            }
        });

        if (Object.keys(fieldErrors).length > 0) {
            throw new ValidateError(fieldErrors, '');
        }
        return values;
    }

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
