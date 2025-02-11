const Meta = () => {
  const metaItems = [
    {
      icon: "flaticon-user",
      text: "admin",
      href: "#",
    },
    {
      icon: "flaticon-calendar-1",
      text: "12 tháng 12 , 2024",
      href: "#",
    },
  ];

  return (
    <div className="bp_meta">
      <ul className="mb0">
        {metaItems.map((item, index) => (
          <li key={index} className="list-inline-item">
            <a href={item.href}>
              <span className={item.icon} />
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Meta;
