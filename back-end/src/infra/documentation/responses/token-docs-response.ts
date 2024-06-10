import { ApiProperty } from '@nestjs/swagger'

export class TokenDocsResponse {
  @ApiProperty({
    type: 'JWT',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0ZmYwMjQyZS1jNjBmLTQwMzYtYmE5Yy0zZmQ1YjEzZmQwYjIiLCJpYXQiOjE2MzIwNzI4MzQsImV4cCI6MTYzMjA3NjQzNH0.9Ib5Y5QVQ9Jw2gJ3e2Xz1g8d1U',
  })
  token: string
}
