import { Subject, Subscription, Observable } from "rxjs";
import {
  debounceTime,
  tap,
  switchMap,
  takeUntil,
  filter,
} from "rxjs/operators";

interface User {
  name: string;
}

/**
 * 
用户停止输入 500ms 后，再发送请求；
如果请求没有返回时，用户就再次输入，要取消之前的请求；
不能因为搜索而影响用户正常输入新的字符；
如果用户输入超过 30 个字符，取消所有请求，并显示提示：您输入的字符数过多。

 */
class AutocompleteController {
  /**
   * 每次用户输入任意值，都会从 payload$ 流中获得
   * 比如，用户依次输入 a, b, c
   * 那么 payload$ 流会获得三个值："a", "ab", "abc"
   */
  payload$: Subject<string>;

  subscription: Subscription;

  constructor() {
    // 除了此处的 .subscribe() 调用，其他地方都不应该调用 Observable/Subject 的 subscribe 方法
    this.subscription = this.getAutoSearch().subscribe();
  }

  // 更新 Input 框中的搜索词
  setSearchStr!: (str: string) => void;
  // 更新搜索状态
  setLoading!: (isLoading: boolean) => void;
  // 显示或隐藏警告信息
  toggleWarning!: (isShown?: boolean) => void;
  // 发送请求，获取搜索结果
  searchQuery!: (str: string) => Observable<User[]>;
  // 更新搜索结果列表
  setSearchResults!: (users: User[]) => void;

  // 你要实现的方法
  getAutoSearch() {
    const stopStream$ = this.payload$.pipe(
      filter((str) => str.length > 30),
      tap(() => {
        this.setLoading(false);
        this.toggleWarning(true);
      })
    );

    const search$ = this.payload$.pipe(
      tap(this.setSearchStr),
      filter((str) => str.length <= 30),
      debounceTime(500),
      tap(() => this.setLoading(true)),
      switchMap((str) => {
        return this.searchQuery(str).pipe(takeUntil(stopStream$));
      }),
      tap(() => this.setLoading(false)),
      tap(this.setSearchResults)
    );

    return search$;
  }
}
