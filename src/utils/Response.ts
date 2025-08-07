import { ApiResonseInterface } from "@/types/ApiResponse";
import { NextResponse } from "next/server";

const ApiResponse = ({
  success,
  message,
  data,
  isAcceptingMessage,
  messages,
}: ApiResonseInterface) => {
  const response: ApiResonseInterface = {
    success,
    message,
  };
  if (data) response.data = data;
  if (isAcceptingMessage) response.isAcceptingMessage = isAcceptingMessage;
  if (messages) response.messages = messages;

  return response;
};

const sendResponse = (
  response: ApiResonseInterface,
  status: number,
  headers?: HeadersInit,
  stream?: ReadableStream
) => {
  if (stream) {
    return new NextResponse(stream, { status, headers });
  } else {
    return NextResponse.json(ApiResponse(response), { status, headers });
  }
};

export default sendResponse;
