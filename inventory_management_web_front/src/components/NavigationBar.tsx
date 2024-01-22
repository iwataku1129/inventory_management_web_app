import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from "@azure/msal-react";
import { useLocation } from 'react-router-dom';
import { Button, Container, Dropdown, DropdownButton, NavDropdown, Nav, Navbar } from "react-bootstrap";
import { loginRequest } from "../config/authConfig";
import { MdAddShoppingCart, MdGroup, MdListAlt, MdFactory, MdSettings, MdOutlineHome } from "react-icons/md";
import { RouteGuardButton } from "./RouteGuard";


export const NavigationBar = () => {
    const { instance } = useMsal();

    const location = useLocation();
    const arrPath = location.pathname.split("/")

    let activeAccount;

    if (instance) {
        activeAccount = instance.getActiveAccount();
    }

    const handleLoginRedirect = () => {
        instance.loginRedirect(loginRequest).catch((error) => console.log(error));
    };
    const handleLogoutRedirect = () => {
        instance.logoutRedirect().catch((error) => console.log(error));
    };

    /**
     * Most applications will need to conditionally render certain components based on whether a user is signed in or not.
     * msal-react provides 2 easy ways to do this. AuthenticatedTemplate and UnauthenticatedTemplate components will
     * only render their children if a user is authenticated or unauthenticated, respectively.
     */
    if (arrPath[1] === "" || arrPath[1] === "admin") {
        // TopPage
        return (
            <>
                <Navbar expand="lg" bg="dark" variant="dark" className="navbarStyle">
                    <Container fluid>
                        <Navbar.Brand href="/">在庫管理</Navbar.Brand>
                        <AuthenticatedTemplate>
                            <Navbar.Toggle aria-controls="navbarScroll" />
                            <Navbar.Collapse id="navbarScroll">
                                <Nav
                                    className="me-auto my-2 my-lg-0"
                                    style={{ maxHeight: '300px' }}
                                    navbarScroll
                                >
                                    <Nav.Link href="/"><><MdOutlineHome size={24} />Home</></Nav.Link>
                                    <RouteGuardButton roleCat="super" alert={false}>
                                        <NavDropdown title={<><MdGroup size={25} />管理ページ</>} id="navbarScrollingDropdown">
                                            <NavDropdown.Item href={`/admin/page`}>{<><MdSettings size={20} />ページ管理</>}</NavDropdown.Item>
                                        </NavDropdown>
                                    </RouteGuardButton>
                                </Nav>
                                <div className="d-flex justify-content-end">
                                    <DropdownButton variant="info" drop="start" title={activeAccount ? activeAccount.name : 'Unknown'}>
                                        <Dropdown.Item as="button" onClick={handleLogoutRedirect}>Sign out</Dropdown.Item>
                                    </DropdownButton>
                                </div>
                            </Navbar.Collapse>
                        </AuthenticatedTemplate>
                        <UnauthenticatedTemplate>
                            <Button size="lg" variant="outline-info" onClick={handleLoginRedirect}>Sign in</Button>
                        </UnauthenticatedTemplate>
                    </Container>
                </Navbar>
            </>
        );
    } else {
        // 各管理ページ
        return (
            <>
                <Navbar expand="lg" bg="dark" variant="dark" className="navbarStyle">
                    <Container fluid>
                        <Navbar.Brand href={`/${arrPath[1]}/summary/product_stock`}>在庫管理 ({arrPath[1]})</Navbar.Brand>
                        <AuthenticatedTemplate>
                            <Navbar.Toggle aria-controls="navbarScroll" />
                            <Navbar.Collapse id="navbarScroll">
                                <Nav
                                    className="me-auto my-2 my-lg-0"
                                    style={{ maxHeight: '300px' }}
                                    navbarScroll
                                >
                                    <NavDropdown title={<><MdAddShoppingCart size={25} />在庫管理</>} id="navbarScrollingDropdown">
                                        <NavDropdown.Item href={`/${arrPath[1]}/order`}>{<><MdAddShoppingCart size={22} />仕入・納品 (在庫増加)</>}</NavDropdown.Item>
                                        <NavDropdown.Item href={`/${arrPath[1]}/day_report/product`}>{<><MdFactory size={20} />使用日報 (在庫減少)</>}</NavDropdown.Item>
                                    </NavDropdown>

                                    <NavDropdown title={<><MdAddShoppingCart size={25} />レポート</>} id="navbarScrollingDropdown">
                                        <NavDropdown.Item href={`/${arrPath[1]}/summary/product_stock`}>{<><MdAddShoppingCart size={22} />在庫表</>}</NavDropdown.Item>
                                        <NavDropdown.Item href={`/${arrPath[1]}/summary/product_hist`}>{<><MdFactory size={20} />出納帳</>}</NavDropdown.Item>
                                    </NavDropdown>

                                    <NavDropdown title={<><MdGroup size={25} />マスタ管理</>} id="navbarScrollingDropdown">
                                        <NavDropdown.Item href={`/${arrPath[1]}/master/product/product`}>{<><MdListAlt size={20} />製品関連</>}</NavDropdown.Item>
                                        <NavDropdown.Item href={`/${arrPath[1]}/master/report/report_category`}>{<><MdListAlt size={20} />在庫関連</>}</NavDropdown.Item>
                                        <RouteGuardButton roleCat="admin" alert={false}>
                                            <NavDropdown.Item href={`/${arrPath[1]}/admin/user`}>{<><MdSettings size={20} />ユーザ管理</>}</NavDropdown.Item>
                                        </RouteGuardButton>
                                    </NavDropdown>
                                    <Nav.Link href="/"><><MdOutlineHome size={24} />Home</></Nav.Link>
                                </Nav>
                                <div className="d-flex justify-content-end">
                                    <DropdownButton variant="info" drop="start" title={activeAccount ? activeAccount.name : 'Unknown'}>
                                        <Dropdown.Item as="button" onClick={handleLogoutRedirect}>Sign out</Dropdown.Item>
                                    </DropdownButton>
                                </div>
                            </Navbar.Collapse>
                        </AuthenticatedTemplate>
                        <UnauthenticatedTemplate>
                            <Button size="lg" variant="outline-info" onClick={handleLoginRedirect}>Sign in</Button>
                        </UnauthenticatedTemplate>
                    </Container>
                </Navbar>
            </>
        );
    }
};