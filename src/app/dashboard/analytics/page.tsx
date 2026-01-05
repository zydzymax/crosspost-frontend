"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface DashboardStats {
  total_posts: number;
  total_views: number;
  total_engagement: number;
  avg_engagement_rate: number;
  top_platform: string;
  best_post_time: string;
}

interface Insight {
  id: string;
  title: string;
  summary: string;
  priority: "high" | "medium" | "low";
  insight_type: string;
  status: "pending" | "applied" | "dismissed";
  recommendations: Array<{
    action: string;
    impact: string;
    effort: string;
  }>;
  created_at: string;
}

interface AnalyticsSettings {
  optimization_mode: "disabled" | "hints_only" | "confirm" | "auto";
  collect_metrics: boolean;
  notify_on_viral: boolean;
  notify_on_drop: boolean;
  notify_weekly_report: boolean;
  auto_adjust_timing: boolean;
  auto_optimize_hashtags: boolean;
}

export default function AnalyticsPage() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [settings, setSettings] = useState<AnalyticsSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "insights" | "settings">("overview");

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://crosspost.saleswhisper.pro/api/v1";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    fetchData(token);
  }, []);

  const fetchData = async (token: string) => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      
      const [dashboardRes, insightsRes, settingsRes] = await Promise.all([
        fetch(`${API_URL}/analytics/dashboard`, { headers }),
        fetch(`${API_URL}/analytics/insights`, { headers }),
        fetch(`${API_URL}/analytics/settings`, { headers }),
      ]);

      if (dashboardRes.ok) {
        setStats(await dashboardRes.json());
      }
      if (insightsRes.ok) {
        setInsights(await insightsRes.json());
      }
      if (settingsRes.ok) {
        setSettings(await settingsRes.json());
      }
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyInsight = async (insightId: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    
    try {
      const res = await fetch(`${API_URL}/analytics/insights/${insightId}/apply`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setInsights(prev =>
          prev.map(i => (i.id === insightId ? { ...i, status: "applied" } : i))
        );
      }
    } catch (error) {
      console.error("Failed to apply insight:", error);
    }
  };

  const dismissInsight = async (insightId: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    
    try {
      const res = await fetch(`${API_URL}/analytics/insights/${insightId}/dismiss`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setInsights(prev =>
          prev.map(i => (i.id === insightId ? { ...i, status: "dismissed" } : i))
        );
      }
    } catch (error) {
      console.error("Failed to dismiss insight:", error);
    }
  };

  const updateSettings = async (newSettings: Partial<AnalyticsSettings>) => {
    if (!settings) return;
    const token = localStorage.getItem("token");
    if (!token) return;
    
    const updated = { ...settings, ...newSettings };
    setSettings(updated);

    try {
      await fetch(`${API_URL}/analytics/settings`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updated),
      });
    } catch (error) {
      console.error("Failed to update settings:", error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800 border-red-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getInsightTypeIcon = (type: string) => {
    switch (type) {
      case "performance_analysis": return "📊";
      case "content_recommendation": return "💡";
      case "timing_suggestion": return "⏰";
      case "audience_insight": return "👥";
      case "trend_alert": return "📈";
      case "optimization_action": return "⚡";
      default: return "📋";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Аналитика контента</h1>
        <p className="text-gray-600 mt-2">AI-анализ эффективности и рекомендации по улучшению</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-8">
        {[
          { id: "overview", label: "Обзор", icon: "📊" },
          { id: "insights", label: "AI-рекомендации", icon: "💡" },
          { id: "settings", label: "Настройки", icon: "⚙️" },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="text-sm text-gray-500 mb-1">Всего постов</div>
              <div className="text-3xl font-bold text-gray-900">{stats?.total_posts || 0}</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="text-sm text-gray-500 mb-1">Просмотры</div>
              <div className="text-3xl font-bold text-gray-900">
                {stats?.total_views?.toLocaleString() || 0}
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="text-sm text-gray-500 mb-1">Вовлечённость</div>
              <div className="text-3xl font-bold text-gray-900">
                {stats?.total_engagement?.toLocaleString() || 0}
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="text-sm text-gray-500 mb-1">Средний ER</div>
              <div className="text-3xl font-bold text-indigo-600">
                {((stats?.avg_engagement_rate || 0) * 100).toFixed(2)}%
              </div>
            </div>
          </div>

          {/* Quick Insights */}
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Ключевые показатели</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <span className="text-2xl">🏆</span>
                <div>
                  <div className="text-sm text-gray-500">Лучшая платформа</div>
                  <div className="font-semibold">{stats?.top_platform || "—"}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <span className="text-2xl">⏰</span>
                <div>
                  <div className="text-sm text-gray-500">Лучшее время публикации</div>
                  <div className="font-semibold">{stats?.best_post_time || "—"}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Insights Preview */}
          {insights.filter(i => i.status === "pending").length > 0 && (
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  💡 Новые рекомендации ({insights.filter(i => i.status === "pending").length})
                </h2>
                <button
                  onClick={() => setActiveTab("insights")}
                  className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  Смотреть все →
                </button>
              </div>
              <div className="space-y-3">
                {insights
                  .filter(i => i.status === "pending")
                  .slice(0, 2)
                  .map(insight => (
                    <div key={insight.id} className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-start gap-3">
                        <span className="text-xl">{getInsightTypeIcon(insight.insight_type)}</span>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{insight.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{insight.summary}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(insight.priority)}`}>
                          {insight.priority === "high" ? "Важно" : insight.priority === "medium" ? "Средне" : "Низко"}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Insights Tab */}
      {activeTab === "insights" && (
        <div className="space-y-4">
          {insights.length === 0 ? (
            <div className="bg-white rounded-xl p-12 shadow-sm border text-center">
              <span className="text-4xl mb-4 block">📊</span>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Пока нет рекомендаций</h3>
              <p className="text-gray-600">
                AI-анализ появится после публикации контента и сбора статистики
              </p>
            </div>
          ) : (
            insights.map(insight => (
              <div
                key={insight.id}
                className={`bg-white rounded-xl p-6 shadow-sm border ${
                  insight.status === "dismissed" ? "opacity-50" : ""
                }`}
              >
                <div className="flex items-start gap-4">
                  <span className="text-3xl">{getInsightTypeIcon(insight.insight_type)}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{insight.title}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(insight.priority)}`}>
                        {insight.priority === "high" ? "Важно" : insight.priority === "medium" ? "Средне" : "Низко"}
                      </span>
                      {insight.status !== "pending" && (
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          insight.status === "applied" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                        }`}>
                          {insight.status === "applied" ? "Применено" : "Отклонено"}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mb-4">{insight.summary}</p>

                    {insight.recommendations && insight.recommendations.length > 0 && (
                      <div className="space-y-2 mb-4">
                        <div className="text-sm font-medium text-gray-700">Рекомендации:</div>
                        {insight.recommendations.map((rec, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                            <span className="text-green-500">•</span>
                            {rec.action}
                            {rec.impact === "high" && (
                              <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">
                                Высокий эффект
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {insight.status === "pending" && (
                      <div className="flex gap-3">
                        <button
                          onClick={() => applyInsight(insight.id)}
                          className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                          Применить
                        </button>
                        <button
                          onClick={() => dismissInsight(insight.id)}
                          className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          Отклонить
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === "settings" && settings && (
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Настройки аналитики</h2>

          {/* Optimization Mode */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Режим оптимизации контента
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { id: "disabled", label: "Выключено", desc: "Без рекомендаций" },
                { id: "hints_only", label: "Только подсказки", desc: "Показывать рекомендации" },
                { id: "confirm", label: "С подтверждением", desc: "Спрашивать перед применением" },
                { id: "auto", label: "Автоматически", desc: "Применять автоматически" },
              ].map(mode => (
                <button
                  key={mode.id}
                  onClick={() => updateSettings({ optimization_mode: mode.id as AnalyticsSettings["optimization_mode"] })}
                  className={`p-4 rounded-lg border-2 text-left transition-colors ${
                    settings.optimization_mode === mode.id
                      ? "border-indigo-600 bg-indigo-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="font-medium text-gray-900">{mode.label}</div>
                  <div className="text-sm text-gray-500 mt-1">{mode.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Auto-optimizations */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Автоматические улучшения</h3>
            <div className="space-y-3">
              {[
                { key: "auto_adjust_timing", label: "Оптимизировать время публикации", desc: "AI подберёт лучшее время" },
                { key: "auto_optimize_hashtags", label: "Оптимизировать хештеги", desc: "AI улучшит хештеги" },
              ].map(item => (
                <label key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer">
                  <div>
                    <div className="font-medium text-gray-900">{item.label}</div>
                    <div className="text-sm text-gray-500">{item.desc}</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings[item.key as keyof AnalyticsSettings] as boolean}
                    onChange={e => updateSettings({ [item.key]: e.target.checked })}
                    className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Уведомления</h3>
            <div className="space-y-3">
              {[
                { key: "notify_on_viral", label: "Вирусный контент", desc: "Когда пост набирает много просмотров" },
                { key: "notify_on_drop", label: "Падение охватов", desc: "Когда охваты сильно снизились" },
                { key: "notify_weekly_report", label: "Недельный отчёт", desc: "Еженедельная сводка аналитики" },
              ].map(item => (
                <label key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer">
                  <div>
                    <div className="font-medium text-gray-900">{item.label}</div>
                    <div className="text-sm text-gray-500">{item.desc}</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings[item.key as keyof AnalyticsSettings] as boolean}
                    onChange={e => updateSettings({ [item.key]: e.target.checked })}
                    className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                  />
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Settings fallback */}
      {activeTab === "settings" && !settings && (
        <div className="bg-white rounded-xl p-6 shadow-sm border text-center">
          <p className="text-gray-600">Настройки загружаются...</p>
        </div>
      )}
    </div>
  );
}
