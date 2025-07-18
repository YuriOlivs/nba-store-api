import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import UserRepository from "../user.repository";
import { Injectable } from "@nestjs/common";
import { STRINGS } from "src/common/strings/global.strings";

@Injectable()
@ValidatorConstraint({ async: true })
export class IsEmailUniqueValidator implements ValidatorConstraintInterface {
   constructor(private repository: UserRepository) {}

   async validate(value: any): Promise<boolean> {
      const userFound = await this.repository.getByEmail(value);
      return !userFound;
   }
}

export const IsEmailUnique = (
   validationOptions: ValidationOptions = { message: STRINGS.alreadyExists('Email') }
) => {
   return (object: object, propertyName: string) => {
      registerDecorator({
         target: object.constructor,
         propertyName: propertyName,
         options: validationOptions,
         constraints: [],
         validator: IsEmailUniqueValidator
      })
   }
}