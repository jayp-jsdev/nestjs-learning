import { Exclude, Expose } from "class-transformer"

export class UserResponseDTO {
    @Expose()
    id: number

    @Expose()
    username: string

    @Expose()
    name:string

    @Expose()
    email: string

    @Exclude()
    password:string
}