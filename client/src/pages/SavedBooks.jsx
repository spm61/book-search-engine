import { useMutation, useQuery } from '@apollo/client';
import { Button, Card, Col, Container, Row } from 'react-bootstrap';
import { REMOVE_BOOK } from '../utils/mutations';
import { QUERY_ME } from '../utils/queries';

import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';

const SavedBooks = () => {
	const [RemoveBook] = useMutation(REMOVE_BOOK, {
		refetchQueries: [QUERY_ME, 'Me'],
	});
	const { loading, data } = useQuery(QUERY_ME);
	const savedBooks = data?.me.savedBooks || [];
	// use this to determine if `useEffect()` hook needs to run again

	//function to delete a book by id.
	const handleDeleteBook = async (bookId) => {
		const token = Auth.loggedIn() ? Auth.getToken() : null;

		if (!token) {
			return false;
		}

		try {
			await RemoveBook({ variables: {bookId} });

			//once deleted, we don't need the book in local storage anymore.
			removeBookId(bookId);
		} catch (err) {
			console.error(err);
		}
	};

	// if data isn't here yet, say so
	if (loading) {
		return <h2>LOADING...</h2>;
	}

	return (
		<>
			<div className="text-light bg-dark p-5">
				<Container>
					<h1>Viewing saved books!</h1>
				</Container>
			</div>
			<Container>
				<h2 className="pt-5">
					{savedBooks.length
						? `Viewing ${savedBooks.length} saved ${
								savedBooks.length === 1 ? 'book' : 'books'
						}:`
						: 'You have no saved books!'}
				</h2>
				<Row>
					{savedBooks.map((book) => {
						return (
							<Col md="4" key={book.bookId}>
								<Card key={book.bookId} border="dark">
									{book.image ? (
										<Card.Img
											src={book.image}
											alt={`The cover for ${book.title}`}
											variant="top"
										/>
									) : null}
									<Card.Body>
										<Card.Title>{book.title}</Card.Title>
										<p className="small">Authors: {book.authors}</p>
										<Card.Text>{book.description}</Card.Text>
										<Button
											className="btn-block btn-danger"
											onClick={() => handleDeleteBook(book.bookId)}>
											Delete this Book!
										</Button>
									</Card.Body>
								</Card>
							</Col>
						);
					})}
				</Row>
			</Container>
		</>
	);
};

export default SavedBooks;