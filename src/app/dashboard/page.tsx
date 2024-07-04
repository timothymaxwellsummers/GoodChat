import React from 'react';
import Chat from './components/chat';
import Options from './components/options';
import Header from '../components/Header';

const DashboardPage: React.FC = () => {
    return (
        <div className='pt-11 pb-16'>
            <Header/>
            <Chat>
                <Options/>
            </Chat>
        </div>
    );
};

export default DashboardPage;