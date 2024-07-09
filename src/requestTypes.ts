import { FindFileReferenceRequest, ReloadProjectNotification } from '@volar/language-server';
import * as coc from 'coc.nvim';

export const FindFileReferenceRequestType = new coc.RequestType<
  FindFileReferenceRequest.ParamsType,
  FindFileReferenceRequest.ResponseType,
  FindFileReferenceRequest.ErrorType
>(FindFileReferenceRequest.type.method);

export const ReloadProjectNotificationType = new coc.NotificationType(ReloadProjectNotification.type.method);
