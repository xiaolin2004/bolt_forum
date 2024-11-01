"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

interface Invitation {
  id: string;
  postId: string;
  postTitle: string;
  inviter: {
    name: string;
    avatar: string;
  };
  timestamp: string;
  status: 'pending' | 'accepted' | 'declined';
}

export default function InvitationsPage() {
  const router = useRouter();
  const [invitations, setInvitations] = useState<Invitation[]>([
    {
      id: '1',
      postId: '1',
      postTitle: '如何优化React应用性能？',
      inviter: {
        name: '张三',
        avatar: '/default-avatar.png',
      },
      timestamp: '2023-10-01 14:30',
      status: 'pending',
    },
    {
      id: '2',
      postId: '2',
      postTitle: '讨论Next.js 13的新特性',
      inviter: {
        name: '李四',
        avatar: '/default-avatar.png',
      },
      timestamp: '2023-10-02 15:45',
      status: 'pending',
    },
  ]);
  const [activeTab, setActiveTab] = useState<'pending' | 'accepted'>('pending');

  const handleInvitationResponse = async (invitationId: string, accept: boolean) => {
    try {
      // In real app, send response to API
      // await respondToInvitation(invitationId, accept);
      
      setInvitations(invitations.map(inv => 
        inv.id === invitationId
          ? { ...inv, status: accept ? 'accepted' : 'declined' }
          : inv
      ));

      if (accept) {
        const invitation = invitations.find(inv => inv.id === invitationId);
        if (invitation) {
          router.push(`/post/${invitation.postId}`);
        }
      }
    } catch (error) {
      console.error('Failed to respond to invitation:', error);
    }
  };

  const pendingInvitations = invitations.filter(inv => inv.status === 'pending');
  const acceptedInvitations = invitations.filter(inv => inv.status === 'accepted');

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-6">邀请回答</h1>
          <div className="flex mb-6">
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-4 py-2 rounded-t-md ${activeTab === 'pending' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              待处理邀请
            </button>
            <button
              onClick={() => setActiveTab('accepted')}
              className={`px-4 py-2 rounded-t-md ${activeTab === 'accepted' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              已接受邀请
            </button>
          </div>

          {activeTab === 'pending' && (
            <div className="space-y-6">
              {pendingInvitations.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  暂无待处理邀请
                </div>
              ) : (
                pendingInvitations.map((invitation) => (
                  <div
                    key={invitation.id}
                    className="border rounded-lg p-4 bg-white"
                  >
                    <div className="flex items-center mb-3">
                      <div className="relative w-8 h-8 rounded-full overflow-hidden mr-3">
                        <Image
                          src={invitation.inviter.avatar}
                          alt={invitation.inviter.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium text-gray-900">
                            {invitation.inviter.name}
                          </span>
                          {' '}邀请你回答
                        </p>
                        <p className="text-sm text-gray-500">{invitation.timestamp}</p>
                      </div>
                    </div>

                    <h2 className="text-lg font-medium mb-3 hover:text-blue-600">
                      <Link href={`/post/${invitation.postId}`}>
                        {invitation.postTitle}
                      </Link>
                    </h2>

                    {invitation.status === 'pending' ? (
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleInvitationResponse(invitation.id, true)}
                          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        >
                          接受邀请
                        </button>
                        <button
                          onClick={() => handleInvitationResponse(invitation.id, false)}
                          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                          婉拒
                        </button>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">
                        已{invitation.status === 'accepted' ? '接受' : '婉拒'}邀请
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'accepted' && (
            <div className="space-y-6">
              {acceptedInvitations.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  暂无已接受邀请
                </div>
              ) : (
                acceptedInvitations.map((invitation) => (
                  <div
                    key={invitation.id}
                    className="border rounded-lg p-4 bg-gray-50"
                  >
                    <div className="flex items-center mb-3">
                      <div className="relative w-8 h-8 rounded-full overflow-hidden mr-3">
                        <Image
                          src={invitation.inviter.avatar}
                          alt={invitation.inviter.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium text-gray-900">
                            {invitation.inviter.name}
                          </span>
                          {' '}邀请你回答
                        </p>
                        <p className="text-sm text-gray-500">{invitation.timestamp}</p>
                      </div>
                    </div>

                    <h2 className="text-lg font-medium mb-3 hover:text-blue-600">
                      <Link href={`/post/${invitation.postId}`}>
                        {invitation.postTitle}
                      </Link>
                    </h2>

                    {invitation.status === 'pending' ? (
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleInvitationResponse(invitation.id, true)}
                          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        >
                          接受邀请
                        </button>
                        <button
                          onClick={() => handleInvitationResponse(invitation.id, false)}
                          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                          婉拒
                        </button>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">
                        已{invitation.status === 'accepted' ? '接受' : '婉拒'}邀请
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}