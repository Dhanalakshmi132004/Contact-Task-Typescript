import { useState } from "react";

interface IContact {
    firstName: string,
    lastName: string,
    number: number
}
enum EView {
    DEFAULT,
    ADDCONTACT,
    VIEWCONTACT,
}
const Contact: React.FC = () => {
    const [contactList, setContactList] = useState<IContact[]>([{
        firstName: "dhana",
        lastName: "lakshmi",
        number: 9876543210
    }, {
        firstName: "shathika",
        lastName: "lakshmi",
        number: 9876543210
    }
    ])

    const [newContact, setNewContact] = useState<IContact>({
        firstName: "",
        lastName: "",
        number: 0
    })

    const [editContact, setEditContact] = useState({
        firstName: "",
        lastName: "",
        number: "",
    });

    const [modal, setModal] = useState<EView>(EView.DEFAULT)
    const [selectedContact, setSelectedContact] = useState<IContact | null>(null)
    const [searchInput, setSearchInput] = useState("");

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditContact((prev) => ({ ...prev, [name]: value }));
    };


    const handleChange = (event) => {
        const { name, value } = event.target;
        setNewContact((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleView = (index: number) => {
        if (selectedContact === contactList[index]) {
            setSelectedContact(null);
        }
        else {
            setSelectedContact(contactList[index])
        }
        setModal(EView.VIEWCONTACT)
    }

    function avator(firstName: string, lastname: string) {
        const firstLetter = firstName.charAt(0).toUpperCase();
        const sceondLettter = lastname.charAt(0).toUpperCase();
        return `${firstLetter}${sceondLettter}`
    }

    const saveContact = (event) => {
        event.preventDefault();
        setContactList((prevList) => [...prevList, newContact])
        setNewContact({ firstName: "", lastName: "", number: 0 });
    }

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
                    onChange={(e) => setSearchInput(e.target.value)}>
                </input>
                <button type="button" className="create-new-button" onClick={() => setModal(EView.ADDCONTACT)}>New Contact</button>

                {filteredContact.map((list, index) => (
                    <ul className="contactList" >
                        <div className="avator-and-name">
                            <div key={index} className="avator">{avator(list.firstName, list.lastName)}</div>
                            <div className="names">{list.firstName}</div>
                        </div>
                        <br></br>
                        <div className="view-and-delete">
                            <button onClick={() => { handleView(index) }}>View</button>
                            <button onClick={() => { deleteTask(index) }}>Delete</button>
                        </div>
                    </ul>
                ))}
            </div>
            <div className="secondContainer">
                {modal === EView.VIEWCONTACT && (
                    <div className="form">
                        <form >
                            <div className="form-list">
                                <label>
                                    <p>First Name</p>
                                    <input type="text" value={selectedContact?.firstName} onChange={handleEditChange}></input>
                                </label>
                                <label>
                                    <p>Last Name</p>
                                    <input value={selectedContact?.lastName}></input>
                                </label>
                                <label>
                                    <p>Phone Number</p>
                                    <input value={selectedContact?.number}></input>
                                </label>
                            </div>
                            <br></br>
                            <div className="edit-save-back">
                                <div>
                                    <button >Edit</button></div>
                                <div>
                                    <button onClick={saveContact}>Save</button></div>
                                <div>
                                    <button onClick={() => setModal(EView.DEFAULT)}>Back</button></div>
                            </div>
                        </form>
                    </div>
                )}

                {modal === EView.ADDCONTACT &&
                    <div className="form">
                        <form>
                            <label>
                                <p>First Name</p>
                                <input type="text" name="firstName" placeholder="Enter the first Name" value={newContact.firstName} onChange={handleChange} />
                            </label>
                            <label>
                                <p>Last Name</p>
                                <input type="text" name="lastName" placeholder="Enter the last Name" value={newContact.lastName} onChange={handleChange}></input>
                            </label>
                            <label>
                                <p>Number</p>
                                <input type="number" name="number" placeholder="Enter the Number" value={newContact.number} onChange={handleChange}></input>
                            </label>
                            <div className="save-and-back">
                                <button onClick={saveContact}>Save</button>
                                <button onClick={() => setModal(EView.DEFAULT)}>Back</button>
                            </div>
                        </form>
                    </div>
                }
            </div>
        </div>
    )
}
export default Contact;