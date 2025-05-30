import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { LogOut, Settings, Newspaper, Activity, Info, Users, Layout } from 'lucide-react';
import NewsForm from './NewsForm';
import ActivityForm from './ActivityForm';
import CustomizationForm from './CustomizationForm';
import HeaderForm from './HeaderForm';
import ProgramForm from './ProgramForm';
import InformationForm from './InformationForm';
import PartnersForm from './PartnersForm';
import OverviewDashboard from './OverviewDashboard';

function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/admin/login');
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-yellow-900">
                Administration - Fête du Bout du Haut
              </h1>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleSignOut}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="mb-6 border-b border-yellow-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', name: 'Vue d\'ensemble', icon: Layout },
              { id: 'header', name: 'Bandeau', icon: Layout },
              { id: 'program', name: 'Programme', icon: Activity },
              { id: 'news', name: 'Actualités', icon: Newspaper },
              { id: 'activities', name: 'Activités', icon: Activity },
              { id: 'information', name: 'Informations', icon: Info },
              { id: 'partners', name: 'Partenaires', icon: Users },
              { id: 'settings', name: 'Paramètres', icon: Settings }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? 'border-yellow-500 text-yellow-600'
                    : 'border-transparent text-yellow-500 hover:text-yellow-700 hover:border-yellow-300'
                } flex items-center px-1 py-4 border-b-2 font-medium text-sm`}
              >
                <tab.icon className="h-5 w-5 mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          {activeTab === 'overview' && (
            <OverviewDashboard />
          )}

          {activeTab === 'header' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-yellow-900">Gestion du bandeau</h2>
              </div>
              <HeaderForm />
            </div>
          )}

          {activeTab === 'program' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-yellow-900">Gestion du programme</h2>
              </div>
              <ProgramForm />
            </div>
          )}

          {activeTab === 'news' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-yellow-900">Gestion des actualités</h2>
              </div>
              <NewsForm />
            </div>
          )}

          {activeTab === 'activities' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-yellow-900">Gestion des activités</h2>
              </div>
              <ActivityForm />
            </div>
          )}

          {activeTab === 'information' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-yellow-900">Gestion des informations</h2>
              </div>
              <InformationForm />
            </div>
          )}

          {activeTab === 'partners' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-yellow-900">Gestion des partenaires</h2>
              </div>
              <PartnersForm />
            </div>
          )}

          {activeTab === 'settings' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-yellow-900">Paramètres</h2>
              </div>
              <CustomizationForm />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
