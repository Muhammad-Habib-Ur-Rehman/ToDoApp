import React from 'react';
import './noticeboard.css';

function NoticeBoard() {
    const announcements = [
        {
            _id: '1',
            title: 'Master Motors - Internship Drive 2025',
            description: 'Applications are now open for the 2025 Internship Program. Apply by July 10th.'
        },
        {
            _id: '2',
            title: 'Master Motors - Plant Visit',
            description: 'A guided plant tour is scheduled for July 5th. All shortlisted candidates must confirm attendance.'
        },
        {
            _id: '3',
            title: 'Master Motors - Final Assessment',
            description: 'Final round interviews will be conducted between July 15–18. Check your email for details.'
        }
    ];

    return (
        <section className="notice-board-container">
            <h2 className="notice-title"> Master Motors Updates</h2>
            <div className="notice-list">
                {announcements.map(({ _id, title, description }) => (
                    <div className="notice-card" key={_id}>
                        <h4>{title}</h4>
                        <p>{description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default NoticeBoard;
