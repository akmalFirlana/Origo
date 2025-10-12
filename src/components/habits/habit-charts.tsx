"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface HabitCompletionData {
  name: string;
  completed: number;
  target: number;
  streak: number;
}

interface HabitCompletionChartProps {
  data: HabitCompletionData[];
}

// Bar chart for habit completion
export function HabitCompletionChart({ data }: HabitCompletionChartProps) {
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 50,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} tick={{ fontSize: 12 }} />
          <YAxis />
          <Tooltip 
            formatter={(value) => [value, 'Days']}
            labelFormatter={(label) => `Habit: ${label}`}
          />
          <Legend />
          <Bar dataKey="completed" name="Completed" fill="#10B981" />
          <Bar dataKey="target" name="Target" fill="#3B82F6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

interface StreakData {
  name: string;
  value: number;
}

interface HabitStreakChartProps {
  data: StreakData[];
}

// Pie chart for habit streaks
export function HabitStreakChart({ data }: HabitStreakChartProps) {
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={true}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [value, 'Days']} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}