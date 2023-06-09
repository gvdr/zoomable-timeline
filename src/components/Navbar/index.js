import React from 'react';
import {
Nav,
NavLink,
Bars,
NavMenu,
NavBtn,
NavBtnLink,
} from './NavbarElements';

const Navbar = () => {
return (
	<>
	<Nav>
		<Bars />

		<NavMenu>

        <NavLink to='/' >
			Home
		</NavLink>
		<NavLink to='/evaluate' >
			Evaluate
		</NavLink>
		<NavLink to='/contribute' >
			Contribute
		</NavLink>
		<NavLink to='/about' >
			About
		</NavLink>
		{/* Second Nav */}
		{/* <NavBtnLink to='/sign-in'>Sign In</NavBtnLink> */}
		</NavMenu>
		<NavBtn>
		<NavBtnLink to='/contribute'>contribute</NavBtnLink>
		</NavBtn>
	</Nav>
	</>
);
};

export default Navbar;
