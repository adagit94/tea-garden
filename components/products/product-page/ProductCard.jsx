import Link from 'next/link';
import React from 'react';
import Card from 'react-bootstrap/Card';

export default function ProductCard({ productData }) {
  return (
    <Card>
      <Card.Img></Card.Img>
      <Card.Body>
        <Card.Title></Card.Title>
        <Card.Text></Card.Text>
      </Card.Body>
    </Card>
  );
}
