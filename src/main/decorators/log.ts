import { LogErrorRepository } from '../../data/protocols/log-error-repository'
import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
export class LogControllerDecorator implements Controller {
  private readonly controller: Controller
  private readonly logErrorRepositoryStub: LogErrorRepository

  constructor (controller: Controller, logErrorRepositoryStub: LogErrorRepository) {
    this.controller = controller
    this.logErrorRepositoryStub = logErrorRepositoryStub
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const httpResponse = await this.controller.handle(httpRequest)
    if (httpResponse.statusCode === 500) {
      await this.logErrorRepositoryStub.logError(httpResponse.body.stack)
    }
    return httpResponse
  }
}
