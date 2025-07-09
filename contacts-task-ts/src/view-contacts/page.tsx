import { useState } from "react";
import React from "react";

interface IContact {
    firstName: string;
    lastName: string;
    number: number;
}

enum EView {
    DEFAULT,
    ADDCONTACT,
    VIEWCONTACT,
}

const Contact: React.FC = () => {
    const [contactList, setContactList] = useState<IContact[]>([
        {
            firstName: "dhana",
            lastName: "lakshmi",
            number: 9876543210,
        },
        {
            firstName: "shathika",
            lastName: "lakshmi",
            number: 9876543210,
        },
    ]);

    const [newContact, setNewContact] = useState<IContact>({
        firstName: "",
        lastName: "",
        number: 0,
    });

    const [editContact, setEditContact] = useState({
        firstName: "",
        lastName: "",
        number: "",
    });

    const [modal, setModal] = useState<EView>(EView.DEFAULT);
    const [selectedContact, setSelectedContact] = useState<IContact | null>(null);
    const [searchInput, setSearchInput] = useState("");
    const [isEditing, setIsEditing] = useState(false);

    // Validation state
    const [errors, setErrors] = useState({
        firstName: "",
        lastName: "",
        number: "",
    });

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditContact((prev) => ({ ...prev, [name]: value }));

        if (value.trim() === "") {
            setErrors((prev) => ({ ...prev, [name]: `${name} is required` }));
        } else {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setNewContact((prev) => ({
            ...prev,
            [name]: name === "number" ? Number(value) : value,
        }));

        if (value.trim() === "") {
            setErrors((prev) => ({ ...prev, [name]: `${name} is required` }));
        } else {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const handleView = (index: number) => {
        if (selectedContact === contactList[index]) {
            setSelectedContact(null);
        } else {
            setSelectedContact(contactList[index]);
        }
        setModal(EView.VIEWCONTACT);
        setIsEditing(false);
        setErrors({ firstName: "", lastName: "", number: "" });
    };

    function avator(firstName: string, lastname: string) {
        const firstLetter = firstName.charAt(0).toUpperCase();
        const secondLetter = lastname.charAt(0).toUpperCase();
        return `${firstLetter}${secondLetter}`;
    }

    const saveContact = (event) => {
        event.preventDefault();

        const newErrors = {
            firstName: newContact.firstName.trim() === "" ? "First name is required" : "",
            lastName: newContact.lastName.trim() === "" ? "Last name is required" : "",
            number: newContact.number.toString().trim() === "" ? "Number is required" : "",
        };

        setErrors(newErrors);

        if (Object.values(newErrors).some((e) => e !== "")) return;

        setContactList((prevList) => [...prevList, newContact]);
        setNewContact({ firstName: "", lastName: "", number: 0 });
        setModal(EView.DEFAULT);
    };

    const saveEditedContact = () => {
        const newErrors = {
            firstName: editContact.firstName.trim() === "" ? "First name is required" : "",
            lastName: editContact.lastName.trim() === "" ? "Last name is required" : "",
            number: editContact.number.trim() === "" ? "Number is required" : "",
        };

        setErrors(newErrors);

        if (Object.values(newErrors).some((e) => e !== "")) return;

        if (selectedContact) {
            const updatedList = contactList.map((c) =>
                c === selectedContact
                    ? {
                        firstName: editContact.firstName,
                        lastName: editContact.lastName,
                        number: parseInt(editContact.number),
                    }
                    : c
            );
            setContactList(updatedList);
            setSelectedContact(null);
            setModal(EView.DEFAULT);
            setIsEditing(false);
        }
    };

    const sortedContact = [...contactList].sort((a, b) =>
        a.firstName.localeCompare(b.firstName)
    );

    const filteredContact = sortedContact.filter((contact) => {
        const lower = searchInput.toLowerCase();
        return (
            contact.firstName.toLowerCase().includes(lower) ||
            contact.lastName.toLowerCase().includes(lower) ||
            contact.number.toString().includes(lower)
        );
    });

    const deleteTask = (indexToDelete: number) => {
        const updatedList = contactList.filter(
            (_, index) => index !== indexToDelete
        );
        setContactList(updatedList);
        setSelectedContact(null);
    };

    return (
        <div className="mainContainer">
            <div className="firstContainer">
                <p className="title">Contacts</p>
                <input
                    type="text"
                    placeholder="Search for contacts"
                    className="searchBar"
                    onChange={(e) => setSearchInput(e.target.value)}
                />
                <button
                    type="button"
                    className="create-new-button"
                    onClick={() => setModal(EView.ADDCONTACT)}
                >
                    New Contact
                </button>

                {filteredContact.map((list, index) => (
                    <ul className="contactList" key={index}>
                        <div className="avator-and-name">
                            <div className="avator">
                                {avator(list.firstName, list.lastName)}
                            </div>
                            <div className="names">{list.firstName}</div>
                        </div>
                        <br />
                        <div className="view-and-delete">
                            <button onClick={() => handleView(index)}>View</button>
                            <button onClick={() => deleteTask(index)}>Delete</button>
                        </div>
                    </ul>
                ))}
            </div>

            <div className="secondContainer">
                {modal === EView.VIEWCONTACT && selectedContact && (
                    <div className="form">
                        <form>
                            <div className="form-list">
                                <label>
                                    <p>First Name</p>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={isEditing ? editContact.firstName : selectedContact.firstName}
                                        onChange={isEditing ? handleEditChange : undefined}
                                        disabled={!isEditing}
                                    />
                                    {errors.firstName && <p style={{ color: "red" }}>{errors.firstName}</p>}
                                </label>
                                <label>
                                    <p>Last Name</p>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={isEditing ? editContact.lastName : selectedContact.lastName}
                                        onChange={isEditing ? handleEditChange : undefined}
                                        disabled={!isEditing}
                                    />
                                    {errors.lastName && <p style={{ color: "red" }}>{errors.lastName}</p>}
                                </label>
                                <label>
                                    <p>Phone Number</p>
                                    <input
                                        type="text"
                                        name="number"
                                        value={isEditing ? editContact.number : selectedContact.number}
                                        onChange={isEditing ? handleEditChange : undefined}
                                        disabled={!isEditing}
                                    />
                                    {errors.number && <p style={{ color: "red" }}>{errors.number}</p>}
                                </label>
                            </div>
                            <br />
                            <div className="edit-save-back">
                                <div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsEditing(true);
                                            setEditContact({
                                                firstName: selectedContact.firstName,
                                                lastName: selectedContact.lastName,
                                                number: selectedContact.number.toString(),
                                            });
                                        }}
                                    >
                                        Edit
                                    </button>
                                </div>
                                <div>
                                    <button type="button" onClick={saveEditedContact}>
                                        Save
                                    </button>
                                </div>
                                <div>
                                    <button type="button" onClick={() => setModal(EView.DEFAULT)}>Back</button>
                                </div>
                            </div>
                        </form>
                    </div>
                )}

                {modal === EView.ADDCONTACT && (
                    <div className="form">
                        <form onSubmit={saveContact}>
                            <label>
                                <p>First Name</p>
                                <input
                                    type="text"
                                    name="firstName"
                                    placeholder="Enter the first Name"
                                    value={newContact.firstName}
                                    onChange={handleChange}
                                />
                                {errors.firstName && <p style={{ color: "red" }}>{errors.firstName}</p>}
                            </label>
                            <label>
                                <p>Last Name</p>
                                <input
                                    type="text"
                                    name="lastName"
                                    placeholder="Enter the last Name"
                                    value={newContact.lastName}
                                    onChange={handleChange}
                                />
                                {errors.lastName && <p style={{ color: "red" }}>{errors.lastName}</p>}
                            </label>
                            <label>
                                <p>Number</p>
                                <input
                                    type="number"
                                    name="number"
                                    placeholder="Enter the Number"
                                    value={newContact.number}
                                    onChange={handleChange}
                                />
                                {errors.number && <p style={{ color: "red" }}>{errors.number}</p>}
                            </label>
                            <div className="save-and-back">
                                <button type="submit">Save</button>
                                <button type="button" onClick={() => setModal(EView.DEFAULT)}>Back</button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Contact;
