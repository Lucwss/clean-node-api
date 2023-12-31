import { Controller, HttpRequest, HttpResponse } from "../../presentation/protocols";
import { LogErrorRepository } from "../../data/protocols/log-error-repository";
import { ServerError } from "../../presentation/errors/server-error";

export class LogControllerDecorator implements Controller {
  private readonly controller: Controller
  private readonly logErrorRepository: LogErrorRepository

  constructor(controller: Controller, logErrorRepository: LogErrorRepository) {
    this.controller = controller;
    this.logErrorRepository = logErrorRepository;
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const httpResponse = await this.controller.handle(httpRequest)
    if (httpResponse.statusCode === 500) {
      const serverError: ServerError = httpResponse.body
      await this.logErrorRepository.logError(serverError.stack)
    }
    return httpResponse
  }

}