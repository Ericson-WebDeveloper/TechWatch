import { Link } from "react-router-dom";


type NavBarItemLinkProps = {
    className: string,
    onClick?: () => void,
    label: string,
    link: string
}

const NavBarItemLink = (props: NavBarItemLinkProps) => {
    const {label, link, ...propData} = props;
    return <li>
        <Link {...propData} to={link}>{label}</Link>
    </li>
}

export default NavBarItemLink;