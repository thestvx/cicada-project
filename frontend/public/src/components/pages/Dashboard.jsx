// frontend/src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState({
    balance: 0,
    todayEarnings: 0,
    activeTasks: 0,
    totalEarnings: 0
  });
  const [earningsData, setEarningsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setStats(response.data.stats);
      setEarningsData(response.data.earningsChart);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const chartData = {
    labels: earningsData.map(d => d.date),
    datasets: [
      {
        label: t('dashboard.earnings'),
        data: earningsData.map(d => d.amount),
        borderColor: '#4ecca3',
        backgroundColor: 'rgba(78, 204, 163, 0.1)',
        tension: 0.4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      }
    }
  };

  if (loading) {
    return <LoadingScreen>{t('common.loading')}</LoadingScreen>;
  }

  return (
    <Container>
      <Header>
        <h1>{t('dashboard.title')}</h1>
      </Header>

      <StatsGrid>
        <StatCard color="#4ecca3">
          <StatValue>${stats.balance.toFixed(2)}</StatValue>
          <StatLabel>{t('dashboard.total_balance')}</StatLabel>
        </StatCard>

        <StatCard color="#3498db">
          <StatValue>${stats.todayEarnings.toFixed(2)}</StatValue>
          <StatLabel>{t('dashboard.today_earnings')}</StatLabel>
        </StatCard>

        <StatCard color="#f39c12">
          <StatValue>{stats.activeTasks}</StatValue>
          <StatLabel>{t('dashboard.active_tasks')}</StatLabel>
        </StatCard>

        <StatCard color="#e74c3c">
          <StatValue>${stats.totalEarnings.toFixed(2)}</StatValue>
          <StatLabel>{t('dashboard.total_earnings')}</StatLabel>
        </StatCard>
      </StatsGrid>

      <ChartSection>
        <h2>{t('dashboard.earnings_chart')}</h2>
        <Line data={chartData} options={chartOptions} />
      </ChartSection>

      <QuickActions>
        <h2>{t('dashboard.quick_actions')}</h2>
        <ActionsGrid>
          <ActionCard href="/deposits">
            {t('dashboard.deposit_funds')}
          </ActionCard>
          <ActionCard href="/withdrawals">
            {t('dashboard.withdraw')}
          </ActionCard>
          <ActionCard href="/tasks">
            {t('dashboard.view_tasks')}
          </ActionCard>
          <ActionCard href="/investments">
            {t('investment.title')}
          </ActionCard>
        </ActionsGrid>
      </QuickActions>
    </Container>
  );
};

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.div`
  margin-bottom: 2rem;

  h1 {
    color: #1a1a2e;
    font-size: 2rem;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
`;

const StatCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  border-left: 4px solid ${props => props.color};
`;

const StatValue = styled.div`
  font-size: 2.5rem;
  font-weight: bold;
  color: #1a1a2e;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 1rem;
  color: #7f8c8d;
`;

const ChartSection = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  margin-bottom: 3rem;

  h2 {
    margin-bottom: 1.5rem;
    color: #1a1a2e;
  }
`;

const QuickActions = styled.div`
  h2 {
    margin-bottom: 1.5rem;
    color: #1a1a2e;
  }
`;

const ActionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const ActionCard = styled.a`
  background: linear-gradient(135deg, #4ecca3, #3498db);
  color: white;
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
  text-decoration: none;
  font-weight: 600;
  transition: transform 0.3s, box-shadow 0.3s;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0,0,0,0.2);
  }
`;

const LoadingScreen = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 1.5rem;
  color: #1a1a2e;
`;

export default Dashboard;
