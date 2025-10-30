const Overview = ({
    specifications,
}: {
    specifications?: { name: string; value: string }[];
}) => {
    return (
        <ul className="list-group">
            {specifications?.map((item, index) => (
                <li
                    className="list-group-item d-flex justify-content-between align-items-start"
                    key={index}
                >
                    <div className="me-auto">
                        <div className="day">{item.name}</div>
                    </div>
                    <span className="schedule">{item.value}</span>
                </li>
            ))}
        </ul>
    );
};

export default Overview;
