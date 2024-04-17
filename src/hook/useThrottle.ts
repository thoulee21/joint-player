import { useRef } from 'react';

/**
 * 一个自定义的钩子函数，用于限制函数的执行频率。
 * @param fn 要被限制频率的函数。
 * @param delay 在执行函数之前的延迟时间（以毫秒为单位）。@default 300
 * @returns 一个被限制频率的函数版本。
 */
export function useThrottle(fn: Function, delay: number = 300) {
  // 创建一个引用对象，用于存储定时器
  const { current } = useRef<{ timer?: NodeJS.Timeout }>({});

  // 返回一个函数作为结果
  return function (this: any, ...args: any[]) {
    // 如果定时器不存在
    if (!current.timer) {
      // 创建一个定时器，延迟指定的时间后执行
      current.timer = setTimeout(() => {
        // 删除定时器
        delete current.timer;
      }, delay);

      // 调用传入的函数，并传递参数
      fn.apply(this, args);
    }
  };
}
