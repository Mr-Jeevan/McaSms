import EditableTable from '../utils-tries/EditableTable';

const dummyData = [
    { id: 1, name: 'Alice', age: 20 },
    { id: 2, name: 'Bob', age: 22 },
    { id: 3, name: 'Charlie', age: 21 },
];

function LongPress() {
    return (
        <div className="container mt-4">
            <h2>Student List</h2>
            <EditableTable data={dummyData} />
        </div>
    );
}

export default LongPress;
