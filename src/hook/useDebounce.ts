import { useRef } from "react";

/**
 * 这个函数创建了一个防抖函数的版本。
 * 它会延迟指定的毫秒数后再调用防抖函数。
 * 它可以将多次短时间内的高频操作优化为只在最后一次执行，用于优化性能。
 * @param fn 要防抖的函数。
 * @param delay 延迟的毫秒数。@default 300
 * @returns 提供函数的防抖版本。
 */
export function useDebounce(fn: Function, delay: number = 300) {
  const { current } = useRef<{ timer?: NodeJS.Timeout }>({});
  return function (this: any, ...args: any[]) {
    if (current.timer) {
      clearTimeout(current.timer);
    }
    current.timer = setTimeout(() => fn.apply(this, args), delay);
  };
}
