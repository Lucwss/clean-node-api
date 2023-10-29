import { Controller, HttpRequest, HttpResponse } from "../../presentation/protocols";
import { LogControllerDecorator } from "./log";

interface SutTypes {
  sut: LogControllerDecorator
  controllerStub: Controller
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

const makeSut = (): SutTypes =>  {
    const controllerStub = makeController()
    
    const sut = new LogControllerDecorator(controllerStub)
    return {
      sut,
      controllerStub
    }
}

describe('LogContrllerDecorator', () => {
  test('should call controller handle ', async () => {
    const { sut, controllerStub } = makeSut()
    const htpRequest = {
      body: {
        email: 'any_valid_email@email.com',
        name: 'any_valid_name',
        password: 'any_valid_password',
        passwordConfirmation: 'any_valid_password'
      }
    }
    const handleSpy = jest.spyOn(controllerStub, 'handle')
    await sut.handle(htpRequest)
    expect(handleSpy).toHaveBeenCalledWith(htpRequest)
  });
});