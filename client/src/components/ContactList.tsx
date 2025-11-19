import { useGetAllContactsQuery } from "@/store/slices/messageApi";
import { useDispatch } from "react-redux";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import { setSelectedUser } from "@/store/slices/chat";
import { UserIcon } from "lucide-react";

function ContactList() {
  const { data: contacts = [], isLoading } = useGetAllContactsQuery(undefined);
  const dispatch = useDispatch();

  if (isLoading) return <UsersLoadingSkeleton />;

  return (
    <>
      {contacts.map((contact) => (
        <div
          key={contact._id}
          className="bg-primary/5 hover:bg-primary/25 transition-colors px-4 py-2 mb-2 rounded-lg cursor-pointer"
          onClick={() => dispatch(setSelectedUser(contact))}
        >
          <div className="flex items-center gap-2">
            <UserIcon className="size-11 bg-primary/15 p-2 rounded-full" />
            <p className="text-sm font-medium">{contact.name}</p>
          </div>
        </div>
      ))}
    </>
  );
}

export default ContactList;
