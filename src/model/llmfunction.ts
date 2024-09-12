import { ClientData } from '@/context/ClientContext';
import { RunnableFunction } from 'openai/lib/RunnableFunction.mjs';

export interface ToolContext {
  clients: ClientData[];
}

export type LLMFunctionWithContext<Args extends object | string> = Omit<
  RunnableFunction<Args>,
  'function'
> & {
  function: (context: ToolContext) => RunnableFunction<Args>['function'];
};
