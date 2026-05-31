'use client';

import { useState, useEffect, useMemo } from 'react';
import PageHeader from '@/components/pageheader';
import StatCard from '@/components/statcard';

interface Member {
    name: string;
    email: string;
    society: string;
    date: string;
    role: string;
    regId: string;
    event: string;
}

const ROLES = [
    'President', 'Vice President', 'Secretary', 'Treasurer',
    'Coordinator', 'Event Head', 'Committee Member', 'Member'
];
const SOCIETIES = [
    'IT Society', 'MediaSociety', 'Sports Club', 'IEEE Student Branch',
    'Gavel Club', 'Rotaract Club', 'Leo Club', 'Art & Drama Society'
];
const EVENTS = [
    'Tech Fest 2026', 'Media Night', 'Annual Sports Meet',
    'National Hackathon', 'Welfare Charity Drive', 'General Convocation'
];
const ITEMS_PER_PAGE = 10;

export default function MembersPage() {
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [filterRole, setFilterRole] = useState('');
    const [filterSociety, setFilterSociety] = useState('');
    const [filterEvent, setFilterEvent] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    // Modals state
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState<Member | null>(null);
    const [editForm, setEditForm] = useState<Member>({
        name: '', email: '', society: '', date: '', role: '', regId: '', event: ''
    });
    const [addForm, setAddForm] = useState<Member>({
        name: '', email: '', society: '', date: '', role: '', regId: '', event: ''
    });

    useEffect(() => {
        // Replace with your actual API call
        const dummyMembers: Member[] = [
            { name: 'John Doe', email: 'john@example.com', society: 'IT Society', date: '2025-01-15', role: 'President', regId: 'REG-001', event: 'Tech Fest 2026' },
            { name: 'Jane Smith', email: 'jane@example.com', society: 'IEEE Student Branch', date: '2025-02-10', role: 'Secretary', regId: 'REG-002', event: 'National Hackathon' },
        ];
        setMembers(dummyMembers);
        setLoading(false);
    }, []);

    const filteredMembers = useMemo(() => {
        return members.filter((member) => {
            const matchesName = member.name.toLowerCase().includes(searchKeyword.toLowerCase());
            const matchesRole = !filterRole || member.role.toLowerCase() === filterRole.toLowerCase();
            const matchesSociety = !filterSociety || member.society.toLowerCase() === filterSociety.toLowerCase();
            const matchesEvent = !filterEvent || member.event.toLowerCase() === filterEvent.toLowerCase();
            return matchesName && matchesRole && matchesSociety && matchesEvent;
        });
    }, [members, searchKeyword, filterRole, filterSociety, filterEvent]);

    const totalPages = Math.ceil(filteredMembers.length / ITEMS_PER_PAGE) || 1;
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const displayedMembers = filteredMembers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchKeyword, filterRole, filterSociety, filterEvent]);

    useEffect(() => {
        if (currentPage > totalPages) setCurrentPage(totalPages);
    }, [currentPage, totalPages]);

    // Add member
    const openAddModal = () => {
        setAddForm({
            name: '', email: '', society: filterSociety || '', date: '', role: filterRole || '', regId: '', event: filterEvent || ''
        });
        setIsAddModalOpen(true);
    };

    const addMember = () => {
        if (!addForm.name.trim()) {
            alert('Name is required');
            return;
        }
        setMembers([...members, addForm]);
        setIsAddModalOpen(false);
        const newTotalPages = Math.ceil((members.length + 1) / ITEMS_PER_PAGE);
        setCurrentPage(newTotalPages);
    };

    // View member
    const openViewModal = (member: Member) => {
        setSelectedMember(member);
        setIsViewModalOpen(true);
    };

    // Edit member
    const openEditModal = (member: Member) => {
        setSelectedMember(member);
        setEditForm({ ...member });
        setIsEditModalOpen(true);
    };

    const updateMember = () => {
        if (!editForm.name.trim()) {
            alert('Name is required');
            return;
        }
        const updatedMembers = members.map(m => m === selectedMember ? editForm : m);
        setMembers(updatedMembers);
        setIsEditModalOpen(false);
    };

    // Delete member
    const handleDeleteMember = (member: Member) => {
        if (confirm('Are you sure you want to remove this member?')) {
            const updatedMembers = members.filter(m => m !== member);
            setMembers(updatedMembers.length ? updatedMembers : []);
        }
    };

    const handleSave = async () => {
        console.log('Saving members:', members);
        alert('Data saved successfully!');
    };

    const totalMembers = members.length;
    const uniqueRoles = new Set(members.map(m => m.role)).size;
    const uniqueSocieties = new Set(members.map(m => m.society)).size;

    if (loading) {
        return <div className="p-8 text-center text-gray-600">Loading members...</div>;
    }

    return (
        <div className="flex h-screen bg-gray-100 text-gray-900">
            <div className="flex flex-1 flex-col overflow-auto">
                <main className="p-6">
                    <PageHeader
                        title="Members Management"
                        description="Manage all members linked to societies and events. Add, edit, or remove members."
                        actionLabel="+ Add Member"
                        onActionClick={openAddModal}
                    />



                    <div className="mb-6 flex justify-end">
                        <button
                            onClick={openAddModal}
                            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                        >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Add Member
                        </button>
                    </div>

                    {/* Statistics Cards */}
                    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <StatCard title="Total Members" value={totalMembers} description="Active members" />
                        <StatCard title="Distinct Roles" value={uniqueRoles} description="Across all members" />
                        <StatCard title="Societies Involved" value={uniqueSocieties} description="Unique societies" />
                        <StatCard title="Filtered Members" value={filteredMembers.length} description="Current search/filter result" />
                    </div>

                    {/* Filters Card */}
                    <div className="mb-6 rounded-lg bg-white p-5 shadow-sm">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Search by Name</label>
                                <input
                                    type="text"
                                    placeholder="Enter name..."
                                    value={searchKeyword}
                                    onChange={(e) => setSearchKeyword(e.target.value)}
                                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Filter by Role</label>
                                <select
                                    value={filterRole}
                                    onChange={(e) => setFilterRole(e.target.value)}
                                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 bg-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                >
                                    <option value="">All roles</option>
                                    {ROLES.map(role => <option key={role} value={role}>{role}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Filter by Society</label>
                                <select
                                    value={filterSociety}
                                    onChange={(e) => setFilterSociety(e.target.value)}
                                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 bg-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                >
                                    <option value="">All societies</option>
                                    {SOCIETIES.map(soc => <option key={soc} value={soc}>{soc}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Filter by Event</label>
                                <select
                                    value={filterEvent}
                                    onChange={(e) => setFilterEvent(e.target.value)}
                                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 bg-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                >
                                    <option value="">All events</option>
                                    {EVENTS.map(ev => <option key={ev} value={ev}>{ev}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Members Table */}
                    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Society</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reg ID</th>
                                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {displayedMembers.map((member, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50">
                                        <td className="whitespace-nowrap px-4 py-2 text-sm text-gray-500">{startIndex + idx + 1}</td>
                                        <td className="whitespace-nowrap px-4 py-2 text-sm text-gray-900">{member.name}</td>
                                        <td className="whitespace-nowrap px-4 py-2 text-sm text-gray-500">{member.email}</td>
                                        <td className="whitespace-nowrap px-4 py-2 text-sm text-gray-500">{member.society}</td>
                                        <td className="whitespace-nowrap px-4 py-2 text-sm text-gray-500">{member.date}</td>
                                        <td className="whitespace-nowrap px-4 py-2 text-sm text-gray-500">{member.role}</td>
                                        <td className="whitespace-nowrap px-4 py-2 text-sm text-gray-500">{member.event}</td>
                                        <td className="whitespace-nowrap px-4 py-2 text-sm text-gray-500">{member.regId}</td>
                                        <td className="whitespace-nowrap px-4 py-2 text-center">
                                            <div className="flex justify-center gap-2">
                                                <button onClick={() => openEditModal(member)} className="text-blue-600 hover:text-blue-800" title="Edit">
                                                    {/* <Edit2 size={16} /> */}
                                                    <span>Edit</span>
                                                </button>
                                                <button onClick={() => openViewModal(member)} className="text-green-600 hover:text-green-800" title="View">
                                                    {/* <Eye size={16} /> */}
                                                    <span>View</span>
                                                </button>
                                                <button onClick={() => handleDeleteMember(member)} className="text-red-600 hover:text-red-800" title="Delete">
                                                    {/* <Trash2 size={16} /> */}
                                                    <span>Delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {displayedMembers.length === 0 && (
                                    <tr>
                                        <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                                            No members found. Adjust filters or add a new member.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination & Save */}
                    <div className="mt-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
                        <div className="text-sm text-gray-600">
                            Showing {filteredMembers.length === 0 ? 0 : startIndex + 1} to{' '}
                            {Math.min(startIndex + ITEMS_PER_PAGE, filteredMembers.length)} of {filteredMembers.length} entries
                        </div>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={handleSave}
                                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                            >
                                Save Data
                            </button>
                            <div className="flex gap-1">
                                <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className="rounded border border-gray-300 px-3 py-1 text-sm text-gray-700 bg-white disabled:opacity-50 hover:bg-gray-50">«</button>
                                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="rounded border border-gray-300 px-3 py-1 text-sm text-gray-700 bg-white disabled:opacity-50 hover:bg-gray-50">‹</button>
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    let page = currentPage;
                                    if (totalPages <= 5) page = i + 1;
                                    else if (currentPage <= 3) page = i + 1;
                                    else if (currentPage >= totalPages - 2) page = totalPages - 4 + i;
                                    else page = currentPage - 2 + i;
                                    return (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`rounded border px-3 py-1 text-sm ${page === currentPage ? 'bg-blue-600 text-white border-blue-600' : 'text-gray-700 border-gray-300 bg-white hover:bg-gray-100'}`}
                                        >
                                            {page}
                                        </button>
                                    );
                                })}
                                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="rounded border border-gray-300 px-3 py-1 text-sm text-gray-700 bg-white disabled:opacity-50 hover:bg-gray-50">›</button>
                                <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} className="rounded border border-gray-300 px-3 py-1 text-sm text-gray-700 bg-white disabled:opacity-50 hover:bg-gray-50">»</button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* Add Member Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-gray-900">Add New Member</h2>
                            <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                              X
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Name *</label>
                                <input
                                    type="text"
                                    value={addForm.name}
                                    onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900"
                                    placeholder="Full name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    value={addForm.email}
                                    onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900"
                                    placeholder="email@example.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Society</label>
                                <select
                                    value={addForm.society}
                                    onChange={(e) => setAddForm({ ...addForm, society: e.target.value })}
                                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 bg-white"
                                >
                                    <option value="">Select society</option>
                                    {SOCIETIES.map(soc => <option key={soc} value={soc}>{soc}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Registration Date</label>
                                <input
                                    type="date"
                                    value={addForm.date}
                                    onChange={(e) => setAddForm({ ...addForm, date: e.target.value })}
                                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Role</label>
                                <select
                                    value={addForm.role}
                                    onChange={(e) => setAddForm({ ...addForm, role: e.target.value })}
                                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 bg-white"
                                >
                                    <option value="">Select role</option>
                                    {ROLES.map(role => <option key={role} value={role}>{role}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Event</label>
                                <select
                                    value={addForm.event}
                                    onChange={(e) => setAddForm({ ...addForm, event: e.target.value })}
                                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 bg-white"
                                >
                                    <option value="">Select event</option>
                                    {EVENTS.map(ev => <option key={ev} value={ev}>{ev}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Registration ID</label>
                                <input
                                    type="text"
                                    value={addForm.regId}
                                    onChange={(e) => setAddForm({ ...addForm, regId: e.target.value })}
                                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900"
                                    placeholder="REG-XXX"
                                />
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end gap-3">
                            <button onClick={() => setIsAddModalOpen(false)} className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 bg-white">Cancel</button>
                            <button onClick={addMember} className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">Add Member</button>
                        </div>
                    </div>
                </div>
            )}

            {/* View Member Modal */}
            {isViewModalOpen && selectedMember && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-gray-900">Member Details</h2>
                            <button onClick={() => setIsViewModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                               X
                            </button>
                        </div>
                        <div className="space-y-3">
                            <div><span className="font-medium text-gray-700">Name:</span> <span className="text-gray-900">{selectedMember.name}</span></div>
                            <div><span className="font-medium text-gray-700">Email:</span> <span className="text-gray-900">{selectedMember.email}</span></div>
                            <div><span className="font-medium text-gray-700">Society:</span> <span className="text-gray-900">{selectedMember.society}</span></div>
                            <div><span className="font-medium text-gray-700">Registration Date:</span> <span className="text-gray-900">{selectedMember.date}</span></div>
                            <div><span className="font-medium text-gray-700">Role:</span> <span className="text-gray-900">{selectedMember.role}</span></div>
                            <div><span className="font-medium text-gray-700">Event:</span> <span className="text-gray-900">{selectedMember.event}</span></div>
                            <div><span className="font-medium text-gray-700">Registration ID:</span> <span className="text-gray-900">{selectedMember.regId}</span></div>
                        </div>
                        <div className="mt-6 flex justify-end">
                            <button onClick={() => setIsViewModalOpen(false)} className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300">Close</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Member Modal */}
            {isEditModalOpen && selectedMember && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-gray-900">Edit Member</h2>
                            <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                X
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Name *</label>
                                <input
                                    type="text"
                                    value={editForm.name}
                                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    value={editForm.email}
                                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Society</label>
                                <select
                                    value={editForm.society}
                                    onChange={(e) => setEditForm({ ...editForm, society: e.target.value })}
                                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 bg-white"
                                >
                                    <option value="">Select society</option>
                                    {SOCIETIES.map(soc => <option key={soc} value={soc}>{soc}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Registration Date</label>
                                <input
                                    type="date"
                                    value={editForm.date}
                                    onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Role</label>
                                <select
                                    value={editForm.role}
                                    onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 bg-white"
                                >
                                    <option value="">Select role</option>
                                    {ROLES.map(role => <option key={role} value={role}>{role}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Event</label>
                                <select
                                    value={editForm.event}
                                    onChange={(e) => setEditForm({ ...editForm, event: e.target.value })}
                                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 bg-white"
                                >
                                    <option value="">Select event</option>
                                    {EVENTS.map(ev => <option key={ev} value={ev}>{ev}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Registration ID</label>
                                <input
                                    type="text"
                                    value={editForm.regId}
                                    onChange={(e) => setEditForm({ ...editForm, regId: e.target.value })}
                                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900"
                                />
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end gap-3">
                            <button onClick={() => setIsEditModalOpen(false)} className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 bg-white">Cancel</button>
                            <button onClick={updateMember} className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">Save Changes</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}