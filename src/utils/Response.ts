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
  headers?: HeadersInit
) => {
  const res = NextResponse.json(ApiResponse(response), { status });
  //* setting the header to the response if it is present to set the cookie to browser.
  if (headers) {
    Object.entries(headers).forEach(([key, val]) => {
      res.headers.set(key, val as string);
    });
  }

  return res;
};

export default sendResponse;
