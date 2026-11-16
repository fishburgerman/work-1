import { useState, type ReactNode } from 'react';
import {
  Bell,
  BookOpen,
  Boxes,
  Sparkles,
  ClipboardList,
  Database,
  FileText,
  Headset,
  Info,
  LayoutDashboard,
  Menu,
  Monitor,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  Sun,
  UserPlus,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { useAppData } from './AppData';
import { useTheme } from './theme';
import { cx } from '../ui/primitives';
import { DEMO_COMPANY_NAME } from '../demo/demoData';
import { formatDateJa } from '../domain/date';
import { useEdgeSwipeBack } from './swipeBack';
import { NOTICE_KIND_LABEL, navNoticeSummary } from '../domain/notifications';
import { NavCountBadge } from '../ui/notices';

interface NavItem {
  key: string;
  href: string;
  label: string;
  icon: LucideIcon;
}

/** PCサイドバー: 日常業務 → 管理 の順に並べる (group は Finder のサイドバーの見出しのように区切る) */
export const NAV_ITEMS: (NavItem & { group: '業務' | '管理' })[] = [
  { key: 'dashboard', href: '#/', label: 'ダッシュボード', icon: LayoutDashboard , group: '業務' },
  { key: 'notifications', href: '#/notifications', label: '通知センター', icon: Bell , group: '業務' },
  { key: 'helpdesk', href: '#/helpdesk', label: 'ヘルプデスク', icon: Headset , group: '業務' },
  { key: 'inventory', href: '#/inventory', label: '在庫・資産・購買', icon: Boxes , group: '業務' },
  { key: 'documents', href: '#/documents', label: '書類管理', icon: FileText , group: '業務' },
  { key: 'tasks', href: '#/tasks', label: 'タスク管理', icon: ClipboardList , group: '業務' },
  { key: 'automation', href: '#/automation', label: '自動化センター', icon: Sparkles , group: '業務' },
  { key: 'employees', href: '#/employees', label: '社員管理', icon: Users , group: '管理' },
  { key: 'onboarding', href: '#/onboarding', label: '入社準備', icon: UserPlus , group: '管理' },
  { key: 'faq', href: '#/faq', label: 'FAQ', icon: BookOpen , group: '管理' },
  { key: 'data', href: '#/data', label: 'データ管理', icon: Database , group: '管理' },
  { key: 'settings', href: '#/settings', label: '設定', icon: Settings , group: '管理' },
];

/** スマホ下部ナビ: 頻度の高い4つ + メニュー (iOS の「その他」タブと同じ考え方) */
const BOTTOM_ITEMS: (NavItem & { short: string; covers?: string[] })[] = [
  { key: 'dashboard', href: '#/', label: 'ダッシュボード', short: 'ホーム', icon: LayoutDashboard },
  { key: 'helpdesk', href: '#/helpdesk', label: 'ヘルプデスク', short: '問い合わせ', icon: Headset },
  { key: 'inventory', href: '#/inventory', label: '在庫・資産・購買', short: '在庫', icon: Boxes },
  { key: 'tasks', href: '#/tasks', label: 'タスク管理', short: 'タスク', icon: ClipboardList },
  { key: 'menu', href: '#/menu', label: 'メニュー', short: 'メニュー', icon: Menu, covers: ['menu', 'notifications', 'employees', 'onboarding', 'faq', 'data', 'settings', 'automation', 'documents'] },
];

const FUTURE_MODULES = ['ワークフロー（承認経路）'];

function ThemeButton({ className, iconOnly }: { className?: string; iconOnly?: boolean }) {
  const { mode, cycle } = useTheme();
  const Icon = mode === 'light' ? Sun : mode === 'dark' ? Moon : Monitor;
  const label = mode === 'light' ? 'ライト' : mode === 'dark' ? 'ダーク' : '端末設定';
  return (
    <button
      type="button"
      onClick={cycle}
      className={cx(
        'inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm text-slate-600 transition-colors hover:bg-slate-200/60 lg:min-h-8 lg:rounded-md lg:px-2.5 lg:text-[13px] dark:text-slate-300 dark:hover:bg-surface-hover',
        className,
      )}
      aria-label={`表示テーマ: ${label}（タップで切替）`}
      title={iconOnly ? `表示テーマ: ${label}` : undefined}
    >
      <Icon className="size-4 text-slate-500 dark:text-slate-400" aria-hidden />
      {!iconOnly && <span className="text-xs">{label}</span>}
    </button>
  );
}

function Logo({ compact }: { compact?: boolean }) {
  return (
    <div className="flex min-w-0 items-center gap-2.5">
      <img src="./favicon.svg" alt="" className="size-7 shrink-0" />
      {!compact && (
        <div className="min-w-0 leading-tight">
          <p className="text-[14px] font-bold text-slate-900 dark:text-white">WorkCore</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">業務管理・自動化</p>
        </div>
      )}
    </div>
  );
}

/** デモ環境であることの明示 (本番システムと誤解されないように) */
export function DemoNotice({ compact }: { compact?: boolean }) {
  return (
    <p className={cx('flex items-start gap-1.5 text-slate-500 dark:text-slate-400', compact ? 'text-[10px] leading-snug' : 'text-xs leading-relaxed')}>
      <Info className="mt-0.5 size-3 shrink-0" aria-hidden />
      <span>
        デモ環境：データはこの端末のブラウザにのみ保存されます。複数端末・複数ユーザーでの共有や同時利用、ログイン認証・権限管理、サーバー側でのデータ保護はありません。発注・メール送信・決済は外部に送られません。架空の企業・社員データを使用しています。
      </span>
    </p>
  );
}

const SIDEBAR_KEY = 'workcore-sidebar';
/** サイドバーの折りたたみ (端末に保存。保存できない環境では開いた状態) */
function useSidebarCollapsed(): [boolean, () => void] {
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem(SIDEBAR_KEY) === 'collapsed';
    } catch {
      return false;
    }
  });
  const toggle = () =>
    setCollapsed((v) => {
      try {
        localStorage.setItem(SIDEBAR_KEY, v ? 'expanded' : 'collapsed');
      } catch {
        /* 保存できなくても表示は切り替える */
      }
      return !v;
    });
  return [collapsed, toggle];
}

export function Layout({ active, children }: { active: string; children: ReactNode }) {
  const { notices, unreadCount, today } = useAppData();
  const [collapsed, toggleSidebar] = useSidebarCollapsed();
  useEdgeSwipeBack();
  // バッジはすべて共通の通知 (実データから導出) から数える。件数 = 未処理 (対応が終わるまで残る)
  const summary = (key: string) => navNoticeSummary(notices, key);
  const badgeLabel = (key: string) => {
    const sm = summary(key);
    const parts = (['overdue', 'approval', 'review', 'attention'] as const).map((k) => [k, sm.items.filter((n) => n.kind === k).length] as const).filter(([, c]) => c > 0);
    return `未処理 ${sm.count}件（${parts.map(([k, c]) => `${NOTICE_KIND_LABEL[k]} ${c}`).join('・')}）`;
  };

  return (
    <div className="min-h-dvh">
      {/* キーボード操作で、毎画面のナビを飛ばして本文へ移動する (WCAG 2.4.1) */}
      <a
        href="#main"
        onClick={(e) => {
          // ハッシュで画面を切り替えているため、リンクの移動ではなく本文にフォーカスを移す
          e.preventDefault();
          document.getElementById('main')?.focus();
        }}
        className="sr-only z-[100] rounded-lg bg-navy-800 px-4 py-3 text-sm font-semibold text-white focus:not-sr-only focus:fixed focus:left-3 focus:top-3 dark:bg-navy-500 dark:text-navy-950"
        data-testid="skip-link"
      >
        本文へスキップ
      </a>
      {/* PC: サイドバー (Finder のように、見出しで区切った縦のナビ。折りたたむとアイコンだけ) */}
      <aside
        className={cx(
          'fixed inset-y-0 left-0 z-30 hidden flex-col border-r border-slate-200 bg-sidebar transition-[width] duration-150 lg:flex dark:border-navy-800',
          collapsed ? 'w-16' : 'w-60',
        )}
        data-testid="sidebar"
        data-collapsed={collapsed ? 'true' : 'false'}
      >
        <div className={cx('flex h-14 shrink-0 items-center', collapsed ? 'justify-center px-2' : 'justify-between pl-4 pr-2')}>
          {!collapsed && <Logo />}
          <button
            type="button"
            onClick={toggleSidebar}
            aria-label={collapsed ? 'サイドバーを広げる' : 'サイドバーを折りたたむ'}
            aria-expanded={!collapsed}
            title={collapsed ? 'サイドバーを広げる' : 'サイドバーを折りたたむ'}
            className="inline-flex size-8 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-200/60 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-surface-hover dark:hover:text-slate-100"
            data-testid="sidebar-toggle"
          >
            {collapsed ? <PanelLeftOpen className="size-[18px]" aria-hidden /> : <PanelLeftClose className="size-[18px]" aria-hidden />}
          </button>
        </div>
        <nav className={cx('flex-1 overflow-y-auto pb-3', collapsed ? 'px-2' : 'px-2.5')} aria-label="メインメニュー">
          {(['業務', '管理'] as const).map((group) => (
            <div key={group} className="pt-2 first:pt-0">
              {collapsed ? (
                <div className="mx-2 mb-1.5 mt-1 border-t border-slate-200 first:hidden dark:border-navy-800" aria-hidden />
              ) : (
                <p className="px-2.5 pb-1 pt-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400">{group}</p>
              )}
              <div className="space-y-px">
                {NAV_ITEMS.filter((item) => item.group === group).map((item) => {
                  const on = item.key === active;
                  const n = summary(item.key).count;
                  return (
                    <a
                      key={item.key}
                      href={item.href}
                      aria-current={on ? 'page' : undefined}
                      title={collapsed ? item.label : undefined}
                      className={cx(
                        'relative flex h-8 items-center gap-2.5 rounded-md text-[13px] transition-colors',
                        collapsed ? 'justify-center px-0' : 'px-2.5',
                        on ? 'bg-slate-200/80 font-semibold text-slate-900 dark:bg-navy-800 dark:text-slate-100' : 'text-slate-700 hover:bg-slate-200/50 dark:text-slate-300 dark:hover:bg-surface-hover',
                      )}
                    >
                      <item.icon className={cx('size-4 shrink-0', on ? 'text-navy-600 dark:text-navy-500' : 'text-slate-500 dark:text-slate-600')} aria-hidden />
                      <span className={collapsed ? 'sr-only' : 'min-w-0 flex-1 truncate'}>{item.label}</span>
                      {item.key === 'notifications' ? (
                        unreadCount > 0 && (
                          <span
                            className={cx(
                              'rounded-full px-1.5 text-[11px] font-bold leading-[18px] text-slate-600 ring-1 ring-inset ring-slate-300 dark:text-slate-300 dark:ring-navy-700',
                              collapsed && 'absolute -right-1 -top-1 bg-sidebar !px-1 !text-[10px] !leading-4',
                            )}
                            aria-label={`未読の通知 ${unreadCount}件`}
                          >
                            {unreadCount}
                          </span>
                        )
                      ) : (
                        <NavCountBadge count={n} worst={summary(item.key).worst} label={badgeLabel(item.key)} className={collapsed ? 'absolute -right-1 -top-1 !min-w-4 !px-1 !text-[10px] !leading-4' : '!leading-[18px]'} />
                      )}
                    </a>
                  );
                })}
              </div>
            </div>
          ))}
          {!collapsed && (
            <div className="pt-3">
              <p className="px-2.5 pb-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400">今後追加予定</p>
              {FUTURE_MODULES.map((m) => (
                <p key={m} className="flex h-7 items-center gap-2 px-2.5 text-[12px] text-slate-500 dark:text-slate-400">
                  {m}
                  <span className="ml-auto text-[10px]">準備中</span>
                </p>
              ))}
            </div>
          )}
        </nav>
        <div className={cx('space-y-2 border-t border-slate-200 py-3 dark:border-navy-800', collapsed ? 'px-2' : 'px-4')}>
          {!collapsed && (
            <>
              <p className="text-[12px] text-slate-600 dark:text-slate-300">{formatDateJa(today)}</p>
              <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">{DEMO_COMPANY_NAME}（架空）</p>
              <DemoNotice compact />
            </>
          )}
          <ThemeButton className={collapsed ? 'w-full justify-center !px-0' : '-ml-2.5 w-[calc(100%+1.25rem)]'} iconOnly={collapsed} />
        </div>
      </aside>

      {/* スマホ: ヘッダー */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-slate-50/90 pt-safe backdrop-blur-md lg:hidden dark:border-navy-800 dark:bg-navy-950/90">
        <div className="flex h-14 items-center justify-between px-4">
          <Logo />
          <div className="-mr-2 flex items-center">
            <a
              href="#/notifications"
              className="relative inline-flex size-11 items-center justify-center rounded-lg text-slate-600 dark:text-slate-300"
              data-testid="header-bell"
            >
              {/* 名前は読み上げ用の文字で付ける (見た目の未読数の数字と名前が食い違わないように) */}
              <span className="sr-only">{`通知センター（未処理 ${notices.filter((x) => x.actionable).length}件・未読 ${unreadCount}件）`}</span>
              <Bell className="size-5" aria-hidden />
              {unreadCount > 0 && (
                <span className="absolute right-1 top-1.5 min-w-4 rounded-full bg-navy-700 px-1 text-center text-[10px] font-bold leading-4 text-white dark:bg-navy-500 dark:text-navy-950" aria-hidden>
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </a>
            <ThemeButton />
          </div>
        </div>
      </header>

      <main id="main" tabIndex={-1} className={cx('outline-none transition-[padding] duration-150', collapsed ? 'lg:pl-16' : 'lg:pl-60')}>
        <div className="mx-auto max-w-6xl px-4 pb-28 pt-5 sm:px-6 lg:px-10 lg:pb-16 lg:pt-8" data-swipe-surface>
          {children}
        </div>
      </main>

      {/* スマホ: 下部ナビゲーション */}
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-sidebar/95 pb-safe backdrop-blur-md lg:hidden dark:border-navy-800" aria-label="メインメニュー">
        <div className="grid grid-cols-5">
          {BOTTOM_ITEMS.map((item) => {
            const on = item.key === active || (item.covers?.includes(active) ?? false);
            const n = summary(item.key).count;
            return (
              <a
                key={item.key}
                href={item.href}
                aria-current={on ? 'page' : undefined}
                className={cx('relative flex min-h-16 flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors', on ? 'text-slate-900 dark:text-slate-100' : 'text-slate-500 dark:text-slate-400')}
              >
                {on && <span className="absolute top-0 h-0.5 w-10 rounded-full bg-navy-600 dark:bg-navy-500" aria-hidden />}
                <span className="relative">
                  <item.icon className={cx('size-[22px]', on && 'text-navy-600 dark:text-navy-500')} aria-hidden />
                  <NavCountBadge count={n} worst={summary(item.key).worst} label={badgeLabel(item.key)} className="absolute -right-3 -top-2 !text-[10px] !leading-4" />
                </span>
                {item.short}
              </a>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
