import { LogErrorRepository } from "../../data/protocols/log-error-repository";
import { serverError } from "../../presentation/helpers/http-helper";
import { Controller, HttpRequest, HttpResponse } from "../../presentation/protocols";
import { LogControllerDecorator } from "./log";

interface SutTypes {
  sut: LogControllerDecorator
  controllerStub: Controller
  logErrorRepositoryStub: LogErrorRepository
}

const makeController = (): Controller => {
  class ControllerStub implements Controller {
      async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        const httpResponse: HttpResponse = {
          statusCode: 200,
          body: {
            name: 'Rodrigo',
          }
        }
        return new Promise((resolve) => resolve(httpResponse))
      }
      
    }
    return new ControllerStub()
}

const makeLogErrorRepository = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
      async log(stackError: string): Promise<void> {
        return new Promise((resolve) => resolve(null))
      }
      
    }
    return new LogErrorRepositoryStub()
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    email: 'any_valid_email@email.com',
    name: 'any_valid_name',
    password: 'any_valid_password',
    passwordConfirmation: 'any_valid_password'
  }
})

const makeSut = (): SutTypes =>  {
    const controllerStub = makeController()
    const logErrorRepositoryStub = makeLogErrorRepository()
    
    const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)
    return {
      sut,
      controllerStub,
      logErrorRepositoryStub
    }
}

describe('LogContrllerDecorator', () => {
  test('should call controller handle ', async () => {
    const { sut, controllerStub } = makeSut()
    const htpRequest = makeFakeRequest()
    const handleSpy = jest.spyOn(controllerStub, 'handle')
    await sut.handle(htpRequest)
    expect(handleSpy).toHaveBeenCalledWith(htpRequest)
  });

  test('should return the same retult of controller ', async () => {
    const { sut } = makeSut()
    const htpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(htpRequest)
    expect(httpResponse).toEqual({
          statusCode: 200,
          body: {
            name: 'Rodrigo',
          }
        })
  });

  test('sould call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut()
    const fakeError = new Error('error')
    fakeError.stack = 'any_stack'
    const error = serverError(fakeError)
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'log')
    jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(new Promise(resolve => resolve(error)))
    const htpRequest = makeFakeRequest()
    await sut.handle(htpRequest)
    expect(logSpy).toHaveBeenCalledWith('any_stack')
  })
});