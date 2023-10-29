import {SignUpController} from "../../presentation/controllers/signup/signup";
import {EmailValidatorAdapter} from "../../utils/email-validator-adapter";
import {DbAddAccount} from '../../data/usecases/add-account/db-add-account'
import {BycriptAdapter} from '../../infra/criptography/bcrypt-adapter'
import {AccountMongoRepository} from "../../infra/db/mongodb/account-repository/account";
import {LogMongoRepository} from "../../infra/db/mongodb/log-repository/log";
import { Controller } from "../../presentation/protocols";
import {LogControllerDecorator} from '../decorators/log'

export const makeSignUpController = ():  Controller => {
    const salt = 12
    const bycriptAdapter = new BycriptAdapter(salt)
    const accountMongoRepository = new AccountMongoRepository()
    const logMongoRepository = new LogMongoRepository()
    const dbAddAccount = new DbAddAccount(bycriptAdapter, accountMongoRepository)
    const emailValidatorAdapter = new EmailValidatorAdapter()
    const signUpController = new SignUpController(emailValidatorAdapter, dbAddAccount)
    return new LogControllerDecorator(signUpController, logMongoRepository)
}
