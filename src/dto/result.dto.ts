import { ApiProperty } from "@nestjs/swagger";

export class ResultDto {
    @ApiProperty()
    status: boolean;
    @ApiProperty()
    message: string;
}