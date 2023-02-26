import { ChangeDetectorRef, OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { combineLatest, Subject, Subscription } from 'rxjs';
import { RootLayoutManager } from 'src/app/core/root-layout/root-layout.manager';

@Pipe({ name: 'privacy', pure: false })
export class PrivacyPipe implements PipeTransform, OnDestroy {
  private _subscription: Subscription;

  private currentValue: any;
  private previousValue: any;
  private valueSubject: Subject<any> = new Subject();

  constructor(private cdRef: ChangeDetectorRef, private rootLayoutManager: RootLayoutManager) {}

  transform(value: any): string {
    if (!this._subscription) {
      this.startValueSubscription();
    }
    this.valueSubject.next(value);

    return this.currentValue;
  }

  ngOnDestroy(): void {
    this.valueSubject.unsubscribe();
    this._subscription?.unsubscribe();
  }

  private startValueSubscription(): void {
    this._subscription = combineLatest([this.valueSubject, this.rootLayoutManager.isPrivacyEnabled()]).subscribe(
      ([nextValue, enabled]) => {
        this.previousValue = this.currentValue;
        this.currentValue = enabled ? 'X,XXX.XX' : nextValue;

        // Only trigger change detection if value has changed.
        if (this.previousValue === this.currentValue) return;
        this.cdRef.markForCheck();
      },
    );
  }
}
